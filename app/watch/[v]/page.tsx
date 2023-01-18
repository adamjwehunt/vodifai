import { findBestTranscriptUrl, mapYoutubeCaptions } from './youtubeUtil';
import { Caption, CaptionTrack } from './types';
import { DOMParser } from 'xmldom';
import PlayerContainer from './PlayerContainer';

const baseYoutubeUrl = 'https://www.youtube.com/watch?v=';
const baseVideoStreamInfoUrl =
	'https://video-stream-info-0t47m3binksc.runkit.sh';

async function getYoutubeCaptions(
	captionTracks: CaptionTrack[],
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

async function getVideoDetails(videoId: string, language = 'en'): Promise<any> {
	const playerInfo = await fetch(
		`${baseVideoStreamInfoUrl}/ytinfo?url=${videoId}`
	).then((t) => t.json());

	let captions: Caption[] = [];
	if (playerInfo?.tracks?.length > 0) {
		captions = await getYoutubeCaptions(playerInfo.tracks, language);
	}

	return { ...playerInfo, captions };
}

interface WatchPageProps {
	params: { v: string };
}

export default async function WatchPage({ params: { v } }: WatchPageProps) {
	const videoDetails = await getVideoDetails(v);

	return (
		<PlayerContainer
			youtubeUrl={`${baseYoutubeUrl}${v}`}
			videoDetails={videoDetails}
		/>
	);
}
