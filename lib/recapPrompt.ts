import { Caption, Chapter, ChapterWithCaptions } from '@/app/types';
import { stemmer } from 'stemmer';

/**
 * Main entry point. Creates a recap prompt that handles:
 *  - extremely large transcripts by chunking
 *  - medium transcripts by codifying/trimming
 *  - very short transcripts by falling back to title/desc
 */
export function createRecapPrompt(
	title: string,
	keyWords: string,
	description: string,
	captions: Caption[],
	chapters: Chapter[],
	maxLength: number,
	maxChunkSize = 2000 // user-configurable
) {
	if (!captions.length) {
		// No captions at all -> fallback
		return fallbackPrompt(title, keyWords, description);
	}

	// Combine all text from captions (grouped by chapter if present)
	const transcriptChapters =
		chapters.length > 0
			? groupCaptionsByChapter(captions, chapters).map(
					({ title: chapterTitle, captions }) =>
						reduceText(
							`${chapterTitle} ${captions.map(({ text }) => text).join(' ')}`
						)
			  )
			: [reduceText(captions.map(({ text }) => text).join(' '))];

	// Check if transcript is extremely large. If so, do chunk-based partial summaries first.
	const combinedLength = transcriptChapters
		.join(' ')
		.trim()
		.split(/\s+/).length;

	// If combined length > maxChunkSize, chunk it, partial summarize, then create the final summary
	if (combinedLength > maxChunkSize) {
		return createChunkedSummary(
			transcriptChapters.join(' '), // treat all text as one big chunk
			title,
			keyWords,
			description,
			maxLength,
			maxChunkSize
		);
	}

	// Otherwise normal approach
	return createStandardRecapPrompt(
		title,
		keyWords,
		description,
		transcriptChapters,
		maxLength
	);
}

/**
 * Standard approach for mid-range transcripts:
 * - If short, use shortTranscriptPrompt
 * - Otherwise codify + reduce
 */
function createStandardRecapPrompt(
	title: string,
	keyWords: string,
	description: string,
	transcriptChapters: string[],
	maxLength: number
) {
	const totalWords = transcriptChapters.join(' ').trim().split(/\s+/).length;
	if (totalWords < 30) {
		// Summaries for very short transcripts often need more context from title/description
		return shortTranscriptPrompt(title, keyWords, description);
	}

	const { codifiedTranscript, key } = reduceTranscript(
		codifyTranscript(transcriptChapters),
		maxLength - transcriptPrompt(title, keyWords).length
	);

	return transcriptPrompt(title, keyWords, codifiedTranscript, key);
}

/**
 * If the transcript is extremely large, break it into chunks, partial-summarize each chunk,
 * then combine the partial summaries into one final summary prompt.
 */
function createChunkedSummary(
	combinedTranscript: string,
	title: string,
	keyWords: string,
	description: string,
	maxLength: number,
	maxChunkSize: number
) {
	// 1. Split the big combinedTranscript into chunks of ~maxChunkSize words each
	const transcriptWords = combinedTranscript.split(/\s+/);
	const chunks: string[] = [];
	for (let i = 0; i < transcriptWords.length; i += maxChunkSize) {
		chunks.push(transcriptWords.slice(i, i + maxChunkSize).join(' '));
	}

	// 2. For each chunk, do a partial summarization (codify & reduce)
	const partialSummaries: string[] = [];
	for (const chunk of chunks) {
		const reduced = createStandardRecapPrompt(
			title,
			keyWords,
			description,
			[reduceText(chunk)],
			Math.floor(maxLength / 2) // partial summary can be smaller
		);
		partialSummaries.push(`- ${reduced}`);
	}

	// 3. Combine partial summaries into a single final summary
	const partialCombination = partialSummaries.join(' ');

	// 4. Summarize the partialSummaries themselves, ensuring we keep it within maxLength
	const combinedChapters = [reduceText(partialCombination)];
	const { codifiedTranscript, key } = reduceTranscript(
		codifyTranscript(combinedChapters),
		maxLength - transcriptPrompt(title, keyWords).length
	);

	return transcriptPrompt(title, keyWords, codifiedTranscript, key);
}

/**
 * Main transcript prompt.
 */
function transcriptPrompt(
	title: string,
	keyWords: string,
	codifiedTranscript = '',
	key = ''
) {
	return (
		`Decode text with key:${key} text:${codifiedTranscript} ` +
		'Summarize the video in a concise paragraph with complete sentences. ' +
		'Focus on key points and overall context. Avoid referencing any source or medium. ' +
		'If information is incomplete, also consider title and keywords. ' +
		`If still insufficient then ${fallbackPrompt(title, keyWords)}`
	);
}

/**
 * Fallback prompt used when no transcripts exist or we can’t meaningfully parse them.
 */
function fallbackPrompt(title: string, keyWords: string, description = '') {
	return (
		'Summarize video in a concise paragraph using ' +
		`title:${reduceText(title)}. ` +
		(keyWords?.length ? `keywords:${reduceKeyWords(keyWords)}. ` : '') +
		(description?.length ? `description:${reduceText(description)}. ` : '')
	);
}

/**
 * Special short transcript prompt, relying more on title/desc/keywords,
 * but avoiding mention of "transcript is short," "video," etc.
 */
function shortTranscriptPrompt(
	title: string,
	keyWords: string,
	description: string
) {
	return (
		`Material is extremely brief. Combine any details from ` +
		`title:${reduceText(title)}, keywords:${reduceKeyWords(keyWords)}, ` +
		(description?.length ? `description:${reduceText(description)}, ` : '') +
		'and produce a clear, direct overview focusing on main ideas.'
	);
}

/**
 * reduceTranscript with array-based approach for repeated center-word removal
 */
export function reduceTranscript(
	{ chapters, key }: { chapters: string[]; key: string },
	maxLength: number
) {
	let chapterArrays = chapters.map((chapter) => chapter.split(' '));
	let newKey = key;

	while (totalStringLength(chapterArrays) + newKey.length > maxLength) {
		const lengths = chapterArrays.map((arr) => arr.join(' ').length);
		const totalLength = lengths.reduce((acc, val) => acc + val, 0);

		if (!totalLength || chapterArrays.every((arr) => arr.length <= 1)) {
			break;
		}

		const ratios = lengths.map((len) => len / totalLength);
		const remainingLength = maxLength - newKey.length;
		const targetLengths = ratios.map((r) => Math.round(r * remainingLength));
		const deviations = lengths.map((length, i) => length - targetLengths[i]);

		const maxDeviationIndex = deviations.reduce(
			(iMax, dev, i) => (dev > deviations[iMax] ? i : iMax),
			0
		);

		if (
			chapterArrays[maxDeviationIndex].join(' ').length <=
				targetLengths[maxDeviationIndex] ||
			chapterArrays[maxDeviationIndex].length <= 1
		) {
			break;
		}

		({ chapterArrays, key: newKey } = removeCenterWordByArray(
			{ chapterArrays, key: newKey },
			maxDeviationIndex
		));
	}

	const newChapters = chapterArrays.map((arr) => arr.join(' ').trim());
	return {
		codifiedTranscript: newChapters.join(' ').trim(),
		key: newKey,
	};
}

/**
 * Removes the center word from the specified chapter array, also adjusting the codification key if needed.
 */
function removeCenterWordByArray(
	{ chapterArrays, key }: { chapterArrays: string[][]; key: string },
	index: number
) {
	const words = chapterArrays[index];
	const centerIndex = Math.floor(words.length / 2);
	const centerWord = words[centerIndex];

	words.splice(centerIndex, 1);

	let newKey = key;
	const keyValuePairs = newKey.split(' ');

	// If the removed center word matches a key-value pair, remove it if it’s no longer needed
	keyValuePairs.forEach((keyValuePair) => {
		const [maybeKey, value] = keyValuePair.split('=');
		if (maybeKey === centerWord && !words.includes(value)) {
			const keyStillUsed = chapterArrays.some((arr, i) => {
				if (i === index) return false;
				return arr.includes(maybeKey) || arr.join(' ').includes(`${maybeKey}=`);
			});
			if (!keyStillUsed) {
				newKey = newKey.replace(keyValuePair, '');
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
	const replacementChars =
		'abcdefghijklmnopqrstuvwxyz' +
		'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
		'0123456789' +
		'!@$%^&*' +
		'αβμτ' +
		'$€£';

	const combinedText = chapters.join(' ');
	const wordFrequency = getWordFrequency(combinedText);

	const filteredWords = filterShortWords(wordFrequency);
	const sortedWords = sortWordsByWeight(filteredWords);

	let { wordMap, key } = generateWordMap(sortedWords, replacementChars);

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
		if (frequency > 1 && wordWeight > keyValueTemplate.length) {
			filteredWords[word] = frequency;
		}
	}
	return filteredWords;
}

export function sortWordsByWeight(
	wordFrequency: Record<string, number>
): string[] {
	return Object.keys(wordFrequency).sort((a, b) => {
		return wordFrequency[b] * b.length - wordFrequency[a] * a.length;
	});
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

/**
 * Groups captions by chapters.
 * This allows chunking the transcript if needed.
 */
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
  Combined single-pass cleanup for:
  - URLs, 
  - emails, 
  - phone #s, 
  - crypto addresses, 
  - bracketed text, punctuation, newlines, etc.
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
 * Removes listed words/phrases in a single pass, separating multi-word phrases vs. single words.
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
 * Main text reduction pipeline:
 *  1) Combined removes (URLs, punctuation, etc.)
 *  2) Remove disclaimers & repeated lines
 *  3) Remove known filler/buzz/stop/qualifier words
 *  4) Stem final text
 */
function reduceText(transcript: string) {
	if (!transcript) {
		return '';
	}

	let text = combinedRemove(transcript);

	// 1) disclaimers
	text = removeWords(text, disclaimers);

	// 2) remove repeated lines
	text = removeRepetitiveLines(text);

	// 3) remove buzz/filler/stop words
	text = removeWords(text, [
		...buzzPhrases,
		...qualifierPhrases,
		...buzzWords,
		...stopWords,
		...fillerWords,
	]);

	// 4) stem
	text = stemmer(text);

	return text.trim();
}

/**
 * Remove near-exact repeated lines from the text.
 * Splits by newline or period, reassembles if unique.
 */
function removeRepetitiveLines(text: string): string {
	// Replace multiple periods/newlines with single newline for simpler splitting
	let normalized = text.replace(/[.]+/g, '.\n').replace(/\r?\n+/g, '\n');
	const lines = normalized
		.split('\n')
		.map((l) => l.trim())
		.filter(Boolean);

	const seen = new Set<string>();
	const uniqueLines: string[] = [];

	for (const line of lines) {
		if (!seen.has(line)) {
			seen.add(line);
			uniqueLines.push(line);
		}
	}

	// Rejoin with space or period
	return uniqueLines.join('. ');
}

/**
 * For keywords, do the same cleaning, plus remove duplicates at the end.
 */
function reduceKeyWords(keyWords: string) {
	if (!keyWords) {
		return '';
	}

	let text = reduceText(keyWords);
	text = removeDuplicateWords(text);

	return text;
}

/**
 * Remove duplicate words from a string.
 */
export function removeDuplicateWords(text: string) {
	const words = text.split(' ');
	const uniqueWords = Array.from(new Set(words));
	return uniqueWords.join(' ');
}

// -----------------------------------------------------------------------------------
// Extended data sets for disclaimers, filler, buzz, stop, etc.
// (Now includes more items, removing references to "video" or "content.")
// -----------------------------------------------------------------------------------
const disclaimers = [
	'this is not financial advice',
	'for informational purposes only',
	'please consult a professional',
	'we are not responsible for any decisions',
	'viewer discretion advised',
	'this is not legal advice',
	'for entertainment only',
	'consult your doctor',
	'no liability accepted',
];

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
	'algorithm',
	'engagement',
	'views',
	'like',
	'follow us on social media',
	'subscriber count',
	'viral',
	'channel',
	'footage',
	'upload',
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
	'honestly',
	'seriously',
	'hmm',
	'uhm',
	'mm',
	'kinda',
	'sorta',
	'stuff like that',
	'you know',
	'you see',
	'yknow',
	'basically',
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
	'smash that subscribe button',
	'drop a comment below',
	'leave a like',
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
