import { captionTrack } from 'ytdl-core';
import { Caption } from './types';

export const findBestTranscriptUrl = (
	captionTracks: captionTrack[],
	language = 'en'
): string => {
	const trackMatchesByLanguage = captionTracks
		.filter((track) => track.languageCode === language)
		.sort((a, b) => (b.name.simpleText.includes('auto-generated') ? -1 : 1));

	return (trackMatchesByLanguage[0] || captionTracks[0])?.baseUrl ?? '';
};

export const mapYoutubeCaptions = (transcript: Document): Caption[] => {
	const sentenceNodes = Array.from(transcript.getElementsByTagName('text'));
	return sentenceNodes.map((sentence, index) => ({
		id: index,
		start: parseFloat(sentence.getAttribute('start') as string),
		duration: parseFloat(sentence.getAttribute('dur') as string),
		text: decodeHtmlCharCodes(sentence.textContent as string),
	}));
};

const decodeHtmlCharCodes = (str: string) =>
	str.replace(/(&#(\d+);)/g, (match, capture, charCode) =>
		String.fromCharCode(charCode)
	);
