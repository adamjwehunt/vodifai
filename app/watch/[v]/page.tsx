import { findBestTranscriptUrl, mapYoutubeCaptions } from './youtubeUtil';
import {
	Caption,
	CaptionTrack,
	VideoDetails,
	VideoFormat,
	VideoInfo,
} from './types';
import { DOMParser } from 'xmldom';
import ytdl from 'ytdl-core';
import PlayerContainer from './PlayerContainer';

const baseYoutubeUrl = 'https://www.youtube.com/watch?v=';

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

async function getVideoInfo(
	videoId: string,
	language = 'en'
): Promise<VideoInfo> {
	const info = await ytdl.getInfo(videoId);

	const tracks =
		info.player_response.captions?.playerCaptionsTracklistRenderer
			.captionTracks;

	let captions: Caption[] = [];
	if (tracks?.length) {
		captions = await getYoutubeCaptions(tracks, language);
	}

	return {
		id: videoId,
		url: baseYoutubeUrl + videoId,
		videoDetails: {
			author: {
				id: info.videoDetails.author.id,
				name: info.videoDetails.author.name,
			},
			description: info.videoDetails.description,
			title: info.videoDetails.title,
		},
		captions,
		formats: info.formats,
	};
}

interface WatchPageProps {
	params: { v: string };
}

export default async function WatchPage({ params: { v } }: WatchPageProps) {
	const videoInfo = await getVideoInfo(v);

	return <PlayerContainer videoInfo={videoInfo} />;
}
