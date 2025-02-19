import { VideoInfo } from '@/app/types';
import ytdl, { captionTrack } from '@distube/ytdl-core';
import {
	getVideoColors,
	getWatchViewColors,
	mapThumbnailDetails,
} from '../utils';

export async function getVideoInfo(
	videoId: string
): Promise<{ videoInfo?: VideoInfo; captionTracks?: captionTrack[] }> {
	try {
		const info = await ytdl.getInfo(videoId);

		if (!info.videoDetails) {
			throw new Error('No video details found');
		}

		const videoColors = await getVideoColors(
			mapThumbnailDetails(info.videoDetails.thumbnails)
		);

		return {
			videoInfo: {
				id: videoId,
				url: `https://www.youtube.com/watch?v=${videoId}`,
				videoDetails: {
					author: {
						id: info.videoDetails.author.id,
						name: info.videoDetails.author.name,
					},
					description: info.videoDetails.description ?? '',
					title: info.videoDetails.title,
					duration: parseInt(info.videoDetails.lengthSeconds),
					keywords: info.videoDetails.keywords ?? [],
					chapters: info.videoDetails.chapters ?? [],
				},
				videoColors: getWatchViewColors(videoColors),
				formats: info.formats,
			},
			captionTracks:
				info.player_response.captions?.playerCaptionsTracklistRenderer
					.captionTracks || [],
		};
	} catch (error) {
		console.error(error);
		return { videoInfo: undefined, captionTracks: undefined };
	}
}
