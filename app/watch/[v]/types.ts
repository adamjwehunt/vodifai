import { captionTrack, videoFormat } from 'ytdl-core';

export interface Video {
	type: string;
	id: string;
}

export interface Caption {
	id: number;
	start: number;
	duration: number;
	text: string;
}

export interface VideoDetails {
	title: string;
	description: string | null;
	author: {
		name: string;
		id: string;
	};
	duration: number;
}

export interface VideoInfo {
	id: string;
	url: string;
	formats: videoFormat[];
	videoDetails: VideoDetails;
}
