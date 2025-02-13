import { Caption, Chapter, ChapterWithCaptions } from '@/app/types';
import { stemmer } from 'stemmer';

export function createRecapPrompt(
	title: string,
	keyWords: string,
	description: string,
	captions: Caption[],
	chapters: Chapter[],
	maxLength: number
) {
	if (!captions.length) {
		// No captions at all, just fallback right away
		return fallbackPrompt(title, keyWords, description);
	}

	// Group/clean transcripts by chapter
	const transcriptChapters =
		chapters.length > 0
			? groupCaptionsByChapter(captions, chapters).map(
					({ title: chapterTitle, captions }) =>
						reduceText(
							`${chapterTitle} ${captions.map(({ text }) => text).join(' ')}`
						)
			  )
			: [reduceText(captions.map(({ text }) => text).join(' '))];

	// If the entire transcript is too short, fallback to shortTranscriptPrompt
	const totalWords = transcriptChapters.join(' ').trim().split(/\s+/).length;
	if (totalWords < 30) {
		// Summaries for very short transcripts often need more context from title/description
		return shortTranscriptPrompt(title, keyWords, description);
	}

	// Attempt codification & length reduction
	const { codifiedTranscript, key } = reduceTranscript(
		codifyTranscript(transcriptChapters),
		maxLength - transcriptPrompt(title, keyWords).length
	);

	return transcriptPrompt(title, keyWords, codifiedTranscript, key);
}

/**
 * Default transcript prompt for normal-length transcripts.
 */
const transcriptPrompt = (
	title: string,
	keyWords: string,
	codifiedTranscript = '',
	key = ''
) =>
	`Decode text with key:${key} text:${codifiedTranscript} ` +
	'Summarize the video highlighting important points in a concise paragraph with complete sentences. ' +
	'Focus on clarity and coherence. If the transcript appears incomplete or unhelpful, ' +
	`please also consider the title and keywords. If still insufficient then ${fallbackPrompt(
		title,
		keyWords
	)}`;

/**
 * Fallback prompt used when no transcripts exist or we can’t meaningfully parse them.
 */
const fallbackPrompt = (title: string, keyWords: string, description = '') =>
	'Summarize video in a concise paragraph using ' +
	`title:${reduceText(title)}. ` +
	(keyWords?.length ? `keywords:${reduceKeyWords(keyWords)}. ` : '') +
	(description?.length ? `description:${reduceText(description)}. ` : '');

/**
 * Special short transcript prompt, relying more on title/description.
 */
const shortTranscriptPrompt = (
	title: string,
	keyWords: string,
	description: string
) =>
	`The provided transcript is very short. Using the transcript (if any), along with ` +
	`title:${reduceText(title)}, and keywords:${reduceKeyWords(keyWords)}, and ` +
	(description?.length ? `description:${reduceText(description)}, ` : '') +
	`summarize the overall content. Focus on clarity, main ideas, and any relevant context.`;

/**
 * reduceTranscript with array-based approach for repeated center-word removal
 */
export function reduceTranscript(
	{ chapters, key }: { chapters: string[]; key: string },
	maxLength: number
) {
	// Convert each chapter string into an array of words
	let chapterArrays = chapters.map((chapter) => chapter.split(' '));
	let newKey = key;

	// Keep removing center words if length > maxLength
	while (totalStringLength(chapterArrays) + newKey.length > maxLength) {
		// lengths of each joined array
		const lengths = chapterArrays.map((arr) => arr.join(' ').length);
		const totalLength = lengths.reduce((acc, val) => acc + val, 0);

		// If no content or all single-word arrays, no further trimming possible
		if (!totalLength || chapterArrays.every((arr) => arr.length <= 1)) {
			break;
		}

		const ratios = lengths.map((len) => len / totalLength);
		const remainingLength = maxLength - newKey.length;
		const targetLengths = ratios.map((r) => Math.round(r * remainingLength));

		// Deviation: current length - target length
		const deviations = lengths.map((length, i) => length - targetLengths[i]);

		// Pick the chapter with the greatest deviation
		const maxDeviationIndex = deviations.reduce(
			(iMax, dev, i) => (dev > deviations[iMax] ? i : iMax),
			0
		);

		// If that chapter is already at/below target or single-word, break
		if (
			chapterArrays[maxDeviationIndex].join(' ').length <=
				targetLengths[maxDeviationIndex] ||
			chapterArrays[maxDeviationIndex].length <= 1
		) {
			break;
		}

		// Remove center word from that array
		({ chapterArrays, key: newKey } = removeCenterWordByArray(
			{ chapterArrays, key: newKey },
			maxDeviationIndex
		));
	}

	// Re-join arrays
	const newChapters = chapterArrays.map((arr) => arr.join(' ').trim());
	return {
		codifiedTranscript: newChapters.join(' ').trim(),
		key: newKey,
	};
}

/**
 * Removes the center word from the specified chapter array,
 * and adjusts the key if it references the removed word.
 */
function removeCenterWordByArray(
	{ chapterArrays, key }: { chapterArrays: string[][]; key: string },
	index: number
) {
	const words = chapterArrays[index];
	const centerIndex = Math.floor(words.length / 2);
	const centerWord = words[centerIndex];

	// Remove the center word
	words.splice(centerIndex, 1);

	let newKey = key;
	const keyValuePairs = newKey.split(' ');

	// If the removed center word matches a key-value pair in the form X=someWord
	keyValuePairs.forEach((kv) => {
		const [maybeKey, value] = kv.split('=');
		if (maybeKey === centerWord && !words.includes(value)) {
			// Check if maybeKey is used in ANY other chapter arrays
			const keyStillUsed = chapterArrays.some((arr, i) => {
				if (i === index) return false; // we just removed from this one
				return arr.includes(maybeKey) || arr.join(' ').includes(`${maybeKey}=`);
			});
			// If the key isn't used anywhere else, remove it
			if (!keyStillUsed) {
				newKey = newKey.replace(kv, '');
			}
		}
	});

	newKey = newKey.split(' ').filter(Boolean).join(' ');
	return { chapterArrays, key: newKey };
}

/** Utility to measure total joined length of all arrays */
function totalStringLength(chapterArrays: string[][]) {
	return chapterArrays.reduce((acc, arr) => acc + arr.join(' ').length, 0);
}

/** Codify transcript to compress repeated words */
export function codifyTranscript(chapters: string[]) {
	// Single characters that count as one token, see OpenAI docs re: tokenization
	const replacementChars =
		'abcdefghijklmnopqrstuvwxyz' +
		'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
		'0123456789' +
		'!@$%^&*' +
		'αβμτ' +
		'$€£';

	const combinedText = chapters.join(' ');
	const wordFrequency = getWordFrequency(combinedText);

	// Filter out words that occur once or are too short
	const filteredWords = filterShortWords(wordFrequency);

	// Sort words by frequency * length
	const sortedWords = sortWordsByWeight(filteredWords);

	// Generate the key string + mapping from words to replacement characters
	let { wordMap, key } = generateWordMap(sortedWords, replacementChars);

	// Replace words in chapters
	const codifiedChapters = chapters.map((chapter) => {
		for (const [word, replacementChar] of Object.entries(wordMap)) {
			chapter = chapter.replace(
				new RegExp(`\\b${word}\\b`, 'g'),
				replacementChar
			);
		}
		return chapter;
	});

	return { chapters: codifiedChapters, key };
}

export function getWordFrequency(text: string): Record<string, number> {
	return text
		.split(' ')
		.reduce((freq: Record<string, number>, word: string) => {
			freq[word] = (freq[word] || 0) + 1;
			return freq;
		}, {});
}

export function filterShortWords(wordFrequency: Record<string, number>) {
	const filteredWords: Record<string, number> = {};
	for (const [word, frequency] of Object.entries(wordFrequency)) {
		const wordWeight = frequency * word.length;
		const keyValueTemplate = `x=${word} `;

		// Filter out low-frequency or short words
		if (frequency > 1 && wordWeight > keyValueTemplate.length) {
			filteredWords[word] = frequency;
		}
	}
	return filteredWords;
}

export function sortWordsByWeight(
	wordFrequency: Record<string, number>
): string[] {
	return Object.keys(wordFrequency).sort(
		(a, b) => wordFrequency[b] * b.length - wordFrequency[a] * a.length
	);
}

export function generateWordMap(
	sortedWords: string[],
	replacementChars: string
) {
	let key = '';
	const wordMap: { [word: string]: string } = {};

	for (let i = 0; i < sortedWords.length && i < replacementChars.length; i++) {
		const word = sortedWords[i];
		const replacementChar = replacementChars[i];
		wordMap[word] = replacementChar;
		key += `${replacementChar}=${word} `;
	}

	return { wordMap, key: key.trim() };
}

/** Chapter grouping helper */
export function groupCaptionsByChapter(
	captions: Caption[],
	chapters: Chapter[]
): ChapterWithCaptions[] {
	const chapterCaptions: ChapterWithCaptions[] = [];

	for (let i = 0; i < chapters.length; i++) {
		const chapterStart = chapters[i].start_time;
		const nextChapterStart =
			i < chapters.length - 1
				? chapters[i + 1].start_time
				: Number.MAX_SAFE_INTEGER;
		const chapterCaptionsList: Caption[] = [];

		for (let j = 0; j < captions.length; j++) {
			const caption = captions[j];
			if (caption.start >= nextChapterStart) {
				break;
			}
			if (caption.start >= chapterStart) {
				chapterCaptionsList.push(caption);
			}
		}

		chapterCaptions.push({
			title: chapters[i].title,
			start_time: chapters[i].start_time,
			captions: chapterCaptionsList,
		});
	}

	return chapterCaptions;
}

/* 
  Combined single-pass cleanup for URLs, emails, phone #s, crypto addresses, 
  bracketed text, punctuation, newlines, etc.
*/
function combinedRemove(text: string): string {
	const mergedPatterns = [
		/(https?:\/\/[^\s]+)/g, // URLs
		/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, // emails
		/\b(?:\d{3}[-.\s]??\d{3}[-.\s]??\d{4}|\(\d{3}\)\s*\d{3}[-.\s]??\d{4}|\d{10})\b/g, // phone
		/(0x)?[A-Fa-f0-9]{40}|(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}|(L|M|t)[a-km-zA-HJ-NP-Z1-9]{26,33}/g, // crypto
		/\[[^\]]*\]\s*/g, // bracketed text
		/[^\w\s]/gi, // punctuation
		/[\r\n]+/g, // newlines
	];

	let cleaned = text.toLowerCase();
	for (const pattern of mergedPatterns) {
		cleaned = cleaned.replace(pattern, '');
	}

	return cleaned;
}

/**
 * Removes listed words/phrases in a single pass, separating multi-word vs. single words.
 */
function removeWords(text: string, removalList: string[]): string {
	const multiWordPhrases = removalList.filter((w) => w.includes(' '));
	const singleWords = removalList.filter((w) => !w.includes(' '));

	// Remove multi-word phrases first
	const multiWordRegex = new RegExp(
		`\\b(?:${multiWordPhrases.join('|')})\\b`,
		'gi'
	);
	let updated = text.replace(multiWordRegex, '');

	// Then remove single words
	const singleWordRegex = new RegExp(
		`\\b(?:${singleWords.join('|')})\\b`,
		'gi'
	);
	updated = updated.replace(singleWordRegex, '');

	return updated.replace(/\s+/g, ' ').trim();
}

/**
 * Main text reduction: runs combinedRemove, removeWords, then stems
 */
function reduceText(transcript: string) {
	if (!transcript) return '';

	let text = combinedRemove(transcript);
	text = removeWords(text, [
		...buzzPhrases,
		...qualifierPhrases,
		...buzzWords,
		...stopWords,
		...fillerWords,
	]);
	text = stemmer(text);

	return text.trim();
}

/**
 * For keywords, we still do the same cleaning, plus remove duplicates at the end.
 */
function reduceKeyWords(keyWords: string) {
	if (!keyWords) return '';

	let text = reduceText(keyWords);
	text = removeDuplicateWords(text);

	return text;
}

// -----------------------------------------------------------------------------------
// Below remain older removal helpers - you can remove them if no longer needed anywhere
// -----------------------------------------------------------------------------------
export function removeUrls(text: string): string {
	return text.replace(/(https?:\/\/[^\s]+)/g, '');
}

export function removeEmails(text: string): string {
	return text.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '');
}

export function removePhoneNumbers(text: string): string {
	return text.replace(
		/\b(?:\d{3}[-.\s]??\d{3}[-.\s]??\d{4}|\(\d{3}\)\s*\d{3}[-.\s]??\d{4}|\d{10})\b/g,
		''
	);
}

export function removeCryptoAddresses(text: string): string {
	return text.replace(
		/(0x)?[A-Fa-f0-9]{40}|(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}|(L|M|t)[a-km-zA-HJ-NP-Z1-9]{26,33}/g,
		''
	);
}

export function removeBracketedText(text: string): string {
	return text.replace(/\[[^\]]*\]\s*/g, '');
}

export function removePunctuation(text: string): string {
	return text.replace(/[^\w\s]/gi, '');
}

export function removeNewLines(text: string): string {
	return text.replace(/[\r\n]+/g, ' ');
}

export function removeExtraSpaces(text: string): string {
	return text.replace(/\s+/g, ' ');
}

export function removePhrasesAndWords(text: string, wordsAndPhrases: string[]) {
	const phraseRegex = new RegExp(
		`\\s*(${wordsAndPhrases.filter((w) => /\s/.test(w)).join('|')})\\s*`,
		'gi'
	);
	const wordRegex = new RegExp(
		`\\b(${wordsAndPhrases.filter((w) => !/\s/.test(w)).join('|')})\\b`,
		'gi'
	);

	return text
		.replace(phraseRegex, '')
		.replace(wordRegex, '')
		.replace(/\s+/g, ' ')
		.trim();
}

export function removeDuplicateWords(text: string) {
	const words = text.split(' ');
	const uniqueWords = Array.from(new Set(words));
	return uniqueWords.join(' ');
}

// -----------------------------------------------------------------------------------
// Additional expanded sets of filler/buzz/qualifier words & phrases
// -----------------------------------------------------------------------------------

const buzzWords = [
	'youtube',
	'facebook',
	'twitter',
	'instagram',
	'comments',
	'comment',
	'subscribe',
	'sponsor',
	'sponsors',
	'patreon',
	'crowdfund',
	'merch',
];

const stopWords = [
	'a',
	'an',
	'and',
	'the',
	'but',
	'or',
	'nor',
	'for',
	'is',
	'are',
	'was',
	'were',
	'in',
	'on',
	'at',
	'by',
	'to',
	'from',
	'with',
	'into',
	'of',
	'for',
	'in',
	'about',
	'as',
	'like',
	'such as',
	'including',
	'i',
	'me',
	'my',
	'we',
	'us',
	'he',
	'him',
	'his',
	'she',
	'her',
	'they',
	'them',
	'their',
	'it',
	'its',
	// More common short words
	'so',
	'up',
	'out',
	'then',
	'now',
	'just',
	'that',
	'this',
	'these',
	'those',
	'be',
	'been',
	'being',
];

const fillerWords = [
	'basically',
	'actually',
	'literally',
	'really',
	'um',
	'uh',
	'okay',
	'ok',
	'like',
	'so',
	'well',
	'anyway',
	'yeah',
	'alright',
	'guys',
	'hey',
	'folks',
	'basically',
	'honestly',
	'seriously',
	'hmm',
	'uhm',
	'mm',
];

const buzzPhrases = [
	'like and subscribe',
	'comment down below',
	'hit the bell icon',
	'share this video with your friends',
	'dont forget to smash that like button',
	'lets get into it',
	'before we start make sure to subscribe',
	'thanks for watching',
	'this video is sponsored by',
	'turn on notifications',
	'be sure to subscribe',
];

const qualifierPhrases = [
	'i think',
	'in my opinion',
	'from my perspective',
	'to my knowledge',
	'as far as i can tell',
	'it seems to me',
	'to the best of my understanding',
	'it appears that',
	'as i understand it',
	'to be honest',
	'i mean',
	'kind of',
	'sort of',
	'you know',
	'if that makes sense',
	'if im being honest',
	'if im being frank',
	'i guess',
	'like i said',
];
