import { captionTrack } from '@distube/ytdl-core';
import he from 'he';
import { DOMParser } from '@xmldom/xmldom';
import { Caption } from '@/app/types';
import { findBestTranscriptUrl, mapYoutubeCaptions } from 'utils/youtubeUtil';

export async function getCaptions(
	captionTracks: captionTrack[],
	language = 'en'
): Promise<Caption[]> {
	if (!captionTracks.length) {
		return [];
	}

	let captions: Caption[] = [];

	captions = await getYoutubeCaptions(captionTracks, language);

	captions = captions.map((caption) => ({
		...caption,
		text: he.decode(caption.text),
	}));

	return captions;
}

async function getYoutubeCaptions(
	captionTracks: captionTrack[],
	language = 'en'
): Promise<Caption[]> {
	const transcript = await fetch(findBestTranscriptUrl(captionTracks, language))
		.then((response) => response.text())
		.then((str) => {
			const parser = new DOMParser();
			return parser.parseFromString(str, 'text/xml');
		});

	return mapYoutubeCaptions(transcript);
}

export function createSearchTranscriptWords(captions: Caption[]): string[] {
	if (!captions.length) {
		return [];
	}

	let words = stripTranscriptText(
		captions.map((caption) => caption.text).join(' ')
	).split(' ');

	words = removeDuplicates(words);
	words = words.sort();

	return words;
}

function removeDuplicates(strings: string[]): string[] {
	if (!strings.length) {
		return [];
	}

	const uniqueStrings: string[] = [];

	for (const string of strings) {
		if (!uniqueStrings.includes(string)) {
			uniqueStrings.push(string);
		}
	}

	return uniqueStrings;
}

export function getCaptionsWithSelectedItem(
	captions: Caption[],
	selectedItem: string | null | undefined
) {
	if (!selectedItem) {
		return [];
	}

	return captions.filter((caption) => {
		const strippedText = stripTranscriptText(caption.text);
		return strippedText.split(' ').includes(selectedItem);
	});
}

export function stripTranscriptText(text: string) {
	return (
		text
			// remove bracketed text (e.g. [Music])
			.replace(/\[.*?\]/g, '')
			// remove new lines
			.replace(/[\r\n]+/g, ' ')
			// remove extra spaces
			.replace(/\s+/g, ' ')
			// remove punctuation from end of words
			.replace(/(\w+['’]?\w*)[^\w\s]*\s*/g, '$1 ')
			.toLowerCase()
			.trim()
	);
}

export function trimRecap(str: string): string {
	const firstUppercaseIndex = Array.from(str).findIndex((char) =>
		/[A-Z]/.test(char)
	);
	return firstUppercaseIndex === -1 ? '' : str.slice(firstUppercaseIndex);
}
