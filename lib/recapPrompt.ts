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
		return fallbackPrompt(title, keyWords, description);
	}

	const transcriptChapters =
		chapters.length > 0
			? groupCaptionsByChapter(captions, chapters).map(
					({ title: chapterTitle, captions }) =>
						reduceText(
							`${chapterTitle} ${captions.map(({ text }) => text).join(' ')}`
						)
			  )
			: [reduceText(captions.map(({ text }) => text).join(' '))];

	const { codifiedTranscript, key } = reduceTranscript(
		codifyTranscript(transcriptChapters),
		maxLength - transcriptPrompt(title, keyWords).length
	);

	return transcriptPrompt(title, keyWords, codifiedTranscript, key);
}

const transcriptPrompt = (
	title: string,
	keyWords: string,
	codifiedTranscript = '',
	key = ''
) =>
	`Decode text with key:${key} text:${codifiedTranscript} ` +
	'Summarize video highlighting key points in a paragraph using complete sentences. ' +
	'If impossible to make an informative summary then' +
	`${fallbackPrompt(title, keyWords)}`;

const fallbackPrompt = (title: string, keyWords: string, description = '') =>
	'Summarize video in a paragraph using ' +
	`title:${reduceText(title)}` +
	`${
		keyWords.length
			? ` keywords:${reduceKeyWords(keyWords)}`
			: '' + description.length
			? ` description:${reduceText(description)}`
			: ''
	}`;

export function reduceTranscript(
	{ chapters, key }: { chapters: string[]; key: string },
	maxLength: number
) {
	const chapterLengths = chapters.map((str) => str.length);
	const totalLength = chapterLengths.reduce((total, length) => total + length, 0);
	const chapterRatios = chapterLengths.map((length) => length / totalLength);

	let targetLengths: number[] = [];
	let newChapters = [...chapters];
	let newKey = key;

	// Removes center word from each chapter until the total length is < maxLength
	// Maintains the ratio of the lengths of each chapter
	while (newChapters.join(' ').length + newKey.length > maxLength) {
		const remainingLength = maxLength - newKey.length;
		targetLengths = chapterRatios.map((ratio) =>
			Math.round(ratio * remainingLength)
		);
		const deviations = newChapters.map(
			(str, i) => str.length - targetLengths[i]
		);
		const maxDeviationIndex = deviations.reduce(
			(iMax, deviation, i) => (deviation > deviations[iMax] ? i : iMax),
			0
		);

		if (
			newChapters[maxDeviationIndex].length <= targetLengths[maxDeviationIndex] ||
			newChapters[maxDeviationIndex].split(' ').length === 1
		) {
			break;
		}

		({ chapters: newChapters, key: newKey } = removeCenterWord(
			{ chapters: newChapters, key: newKey },
			maxDeviationIndex
		));
	}

	return {
		codifiedTranscript: newChapters.join(' ').trim(),
		key: newKey,
	};
}

export function removeCenterWord(
	{ chapters, key }: { chapters: string[]; key: string },
	index: number
) {
	const string = chapters[index];
	const words = string.split(' ');
	const centerIndex = Math.floor(words.length / 2);
	const centerWord = words[centerIndex];
	words.splice(centerIndex, 1);

	const newChapters = [...chapters];
	newChapters[index] = words.join(' ');

	let newKey = key;
	const keyValuePairs = newKey.split(' ');

	// Check if the center word matches a key-value pair
	keyValuePairs.forEach((keyValuePair) => {
		const [maybeKey, value] = keyValuePair.split('=');
		if (maybeKey === centerWord && words.indexOf(value) === -1) {
			// Check if the key exists in any string after centerWord is removed
			const keyExists = chapters.some(
				(str, i) =>
					i !== index &&
					(str.split(' ').includes(maybeKey) || str.includes(`${maybeKey}=`))
			);
			if (!keyExists) {
				// Check if the key exists in the same string after centerWord is removed
				const sameStringWords = words.join(' ');
				if (
					!sameStringWords.includes(`${maybeKey}=`) &&
					sameStringWords.indexOf(maybeKey) === -1
				) {
					newKey = newKey.replace(keyValuePair, '');
				}
			}
		}
	});

	newKey = newKey.split(' ').filter(Boolean).join(' '); // remove empty strings

	return { chapters: newChapters, key: newKey };
}

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

	// Sort words by their frequency * length
	const sortedWords = sortWordsByWeight(filteredWords);

	// Generate the key string + the mapping from words to replacement characters
	let { wordMap, key } = generateWordMap(sortedWords, replacementChars);

	// Replace words in chapters with their corresponding replacement characters
	const codifiedChapters = chapters.map((chapter) => {
		for (const [word, replacementChar] of Object.entries(wordMap)) {
			chapter = chapter.replace(new RegExp(`\\b${word}\\b`, 'g'), replacementChar);
		}
		return chapter;
	});

	return { chapters: codifiedChapters, key };
}

export function getWordFrequency(text: string): Record<string, number> {
	return text.split(' ').reduce((freq: Record<string, number>, word: string) => {
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

export function sortWordsByWeight(wordFrequency: Record<string, number>): string[] {
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
  bracketed text, punctuation, and newlines 
*/
function combinedRemove(text: string): string {
	const mergedPatterns = [
		/(https?:\/\/[^\s]+)/g, // URLs
		/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, // emails
		/\b(?:\d{3}[-.\s]??\d{3}[-.\s]??\d{4}|\(\d{3}\)\s*\d{3}[-.\s]??\d{4}|\d{10})\b/g, // phone
		/(0x)?[A-Fa-f0-9]{40}|(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}|(L|M|t)[a-km-zA-HJ-NP-Z1-9]{26,33}/g, // crypto
		/\[[^\]]*\]\s*/g, // bracketed text
		/[^\w\s]/gi,       // punctuation
		/[\r\n]+/g,        // newlines
	];

	let cleaned = text.toLowerCase();
	for (const pattern of mergedPatterns) {
		cleaned = cleaned.replace(pattern, '');
	}

	return cleaned;
}

/*
  Removes listed words/phrases in a single pass, separating multi-word phrases vs. single words.
*/
function removeWords(text: string, removalList: string[]): string {
	const multiWordPhrases = removalList.filter((w) => w.includes(' '));
	const singleWords = removalList.filter((w) => !w.includes(' '));

	const multiWordRegex = new RegExp(`\\b(?:${multiWordPhrases.join('|')})\\b`, 'gi');
	let updated = text.replace(multiWordRegex, '');

	const singleWordRegex = new RegExp(`\\b(?:${singleWords.join('|')})\\b`, 'gi');
	updated = updated.replace(singleWordRegex, '');

	return updated.replace(/\s+/g, ' ').trim();
}

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

function reduceKeyWords(keyWords: string) {
	if (!keyWords) return '';

	let text = reduceText(keyWords);
	text = removeDuplicateWords(text);

	return text;
}

// Below remain older removal helpers - can be removed if no longer needed:
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
];

const fillerWords = [
	'basically',
	'actually',
	'literally',
	'really',
	'um',
	'uh',
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
];
