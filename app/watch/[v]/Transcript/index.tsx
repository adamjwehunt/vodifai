import { ReactElement } from 'react';
import { DOMParser } from 'xmldom';
import { captionTrack } from 'ytdl-core';
import { TranscriptProvider } from '../TranscriptProvider';
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

async function getCaptions(
	captionTracks: captionTrack[],
	language = 'en'
): Promise<Caption[]> {
	let captions: Caption[] = [];

	if (captionTracks.length) {
		captions = await getYoutubeCaptions(captionTracks, language);
	}

	return captions;
}

interface TranscriptWrapperProps {
	captionTracks: captionTrack[];
	children: ReactElement[];
}

export const Transcript = async ({
	captionTracks,
	children,
}: TranscriptWrapperProps) => {
	const captions = await getCaptions(captionTracks);

	if (!captions.length) {
		return null;
	}

	return (
		<TranscriptProvider captions={captions}>{children}</TranscriptProvider>
	);
};
