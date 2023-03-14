import { Caption, ChapterWithCaptions } from 'app/watch/[v]/types';
import { stemmer } from 'stemmer';
import { Chapter } from 'ytdl-core';

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
			? groupCaptionsByChapter(captions, chapters).map(({ title, captions }) =>
					reduceText(`${title} ${captions.map(({ text }) => text).join(' ')}`)
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
	'If impossible to make an informative summary ' +
	`${fallbackPrompt(title, keyWords)}`;

const fallbackPrompt = (title: string, keyWords: string, description = '') =>
	'Summarize video in a paragraph using ' +
	`title:${removeSpaces(reduceText(title))}` +
	keyWords.length
		? ` keywords:${removeSpaces(reduceKeyWords(keyWords))}`
		: '' + description.length
		? ` description:${removeSpaces(reduceText(description))}`
		: '';

export function trimRecap(str: string): string {
	const firstUppercaseIndex = Array.from(str).findIndex((char) =>
		/[A-Z]/.test(char)
	);
	return firstUppercaseIndex === -1 ? '' : str.slice(firstUppercaseIndex);
}

function reduceTranscript(
	{ chapters, key }: { chapters: string[]; key: string },
	maxLength: number
) {
	const chapterLengths = chapters.map((str) => str.length);
	const chapterRatios = chapterLengths.map(
		(length) =>
			length / chapterLengths.reduce((total, length) => total + length, 0)
	);

	let targetLengths: number[] = [];
	let newChapters = [...chapters];
	let newKey = key;


	// Removes center word from each chapter until the total length is less than maxLength
	// Maintains the ratio of the lengths of each chapter
	while (
		newChapters.join(' ').trim().length + ` ${newKey}`.length >
		maxLength
	) {
		targetLengths = chapterRatios.map((ratio) =>
			Math.floor(
				ratio *
					(maxLength -
						newKey.length +
						countSpaces(newChapters.join(' ').trim()) +
						countSpaces(newKey))
			)
		);
		const deviations = newChapters.map(
			(str, i) => str.length - targetLengths[i]
		);
		const maxDeviationIndex = deviations.reduce(
			(iMax, deviation, i) => (deviation > deviations[iMax] ? i : iMax),
			0
		);

		if (
			newChapters[maxDeviationIndex].length <= targetLengths[maxDeviationIndex]
		) {
			break;
		}

		({ chapters: newChapters, key: newKey } = removeCenterWord(
			{ chapters: newChapters, key: newKey },
			maxDeviationIndex
		));
	}

	return {
		codifiedTranscript: removeSpaces(newChapters.join(' ').trim()),
		key: removeSpaces(newKey),
	};
}

function countSpaces(text: string): number {
	const spacePattern = /\s/g;
	const matches = text.match(spacePattern);
	const count = matches ? matches.length : 0;

	return count;
}

export function removeSpaces(text: string): string {
	const spacePattern = /\s+/g;
	const result = text.replace(spacePattern, '');

	return result;
}

function removeCenterWord(
	{ chapters, key }: { chapters: string[]; key: string },
	index: number
) {
	let newKey = key;
	const string = chapters[index];

	const words: string[] = string.split(' ');
	const centerIndex = Math.floor(words.length / 2);
	const centerWord = words[centerIndex];
	words.splice(centerIndex, 1);

	// Check if the center word matches a key-value pair
	const keyValuePairs = newKey.split(' ');
	keyValuePairs.forEach((keyValuePair) => {
		const [key, value] = keyValuePair.split('=');
		if (key === centerWord && words.indexOf(value) === -1) {
			// Check if the key exists in any string after centerWord is removed
			const keyExists = chapters.some(
				(str, i) =>
					i !== index &&
					(str.split(' ').indexOf(key) !== -1 || str.includes(`${key}=`))
			);
			if (!keyExists) {
				// Check if the key exists in the same string after centerWord is removed
				const sameStringWords = words.join(' ');
				if (
					!sameStringWords.includes(`${key}=`) &&
					sameStringWords.indexOf(key) === -1
				) {
					newKey = newKey.replace(keyValuePair, '');
				}
			}
		}
	});

	const newChapters = [...chapters];
	newChapters[index] = words.join(' ');

	newKey = newKey.split(' ').filter(Boolean).join(' '); // remove empty strings

	return { chapters: newChapters, key: newKey };
}

function codifyTranscript(chapters: string[]) {
	const replacementChars =
		'abcdefghijklmnopqrstuvwxyz' +
		'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
		'0123456789' +
		'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ' +
		'αβγδεζηθικλμνξοπρστυφχψω' +
		'$€£¥元₽฿₺₹₴₩₱﷼';

	// Combine all chapters into a single string
	const combinedText = chapters.join(' ');

	// Split the text into individual words and count their frequency
	const wordFrequency: Record<string, number> = combinedText
		.split(' ')
		.reduce((freq: Record<string, number>, word: string) => {
			freq[word] = (freq[word] || 0) + 1;
			return freq;
		}, {});

	// Sort words by their frequency * length
	const sortedWords = Object.keys(wordFrequency).sort((a, b) => {
		return wordFrequency[b] * b.length - wordFrequency[a] * a.length;
	});

	// Generate the key string and the mapping from words to replacement characters
	let key = '';
	const wordMap: { [word: string]: string } = {};
	for (let i = 0; i < sortedWords.length && i < replacementChars.length; i++) {
		const word = sortedWords[i];
		const replacementChar = replacementChars[i];
		wordMap[word] = replacementChar;
		key += `${replacementChar}=${word} `;
	}

	// Replace words in chapters with their corresponding replacement characters
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

function groupCaptionsByChapter(
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

function reduceText(transcript: string) {
	if (!transcript) {
		return '';
	}

	let text = transcript
		// remove urls
		.replace(/(https?:\/\/[^\s]+)/g, '')
		// remove emails
		.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '')
		// remove phone numbers
		.replace(
			/\b(?:\d{3}[-.\s]??\d{3}[-.\s]??\d{4}|\(\d{3}\)\s*\d{3}[-.\s]??\d{4}|\d{10})\b/g,
			''
		)
		// remove crypto addresses
		.replace(/(0x)?[A-Fa-f0-9]{40}/g, '')
		// remove bracketed text (e.g. [Music])
		.replace(/\[.*?\]/g, '')
		// remove punctuation
		.replace(/[^\w\s]/gi, '')
		// remove new lines
		.replace(/[\r\n]+/g, ' ')
		// remove extra spaces
		.replace(/\s+/g, ' ')
		.toLowerCase();
	text = removeRedundantWords(text);
	text = removePhrases(text, [...buzzPhrases, ...qualifierPhrases]);
	text = removeWords(text, [...buzzWords, ...stopWords, ...fillerWords]);
	text = stemmer(text);

	return text.trim();
}

function reduceKeyWords(keyWords: string) {
	if (!keyWords) {
		return '';
	}

	let text = reduceText(keyWords);
	text = removeDuplicateWords(text);

	return text;
}

function removeRedundantWords(text: string) {
	const words = text.split(' ');
	let result = '';
	let previousWord = '';
	words.forEach((word) => {
		if (word !== previousWord) {
			result += `${word} `;
			previousWord = word;
		}
	});
	return result.trim();
}

function removePhrases(text: string, phrases: string[]) {
	const regex = new RegExp('\\b(' + phrases.join('|') + ')\\b', 'gi');
	return text.replace(regex, '').replace(/\s+/g, ' ').trim();
}

function removeWords(text: string, words: string[]) {
	words.forEach((word) => {
		const regex = new RegExp(`\\b${word}\\b`, 'gi');
		text = text.replace(regex, '');
	});
	return text.replace(/\s+/g, ' ');
}

function removeDuplicateWords(text: string) {
	const words = text.split(' ');
	const uniqueWords = Array.from(new Set(words));
	const filteredText = uniqueWords.join(' ');
	return filteredText;
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
