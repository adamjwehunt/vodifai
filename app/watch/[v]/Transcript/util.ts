import { captionTrack } from 'ytdl-core';
import { DOMParser } from 'xmldom';
import { Caption } from '../types';
import { findBestTranscriptUrl, mapYoutubeCaptions } from '../youtubeUtil';

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

export async function getCaptions(
	captionTracks: captionTrack[],
	language = 'en'
): Promise<Caption[]> {
	let captions: Caption[] = [];

	if (captionTracks.length) {
		captions = await getYoutubeCaptions(captionTracks, language);
	}

	captions = captions.map((caption) => ({
		...caption,
		text: replaceQuotes(caption.text),
	}));

	return captions;
}

function replaceQuotes(str: string): string {
	return str.replace(/&quot;/g, '"');
}
