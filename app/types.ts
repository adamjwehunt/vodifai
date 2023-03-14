import { youtube_v3 } from 'googleapis';
import { Chapter, videoFormat } from 'ytdl-core';

export interface SearchResult {
	videoId: string;
	title: string;
	channelTitle: string;
	viewCount: string;
	videoLength: string;
	publishedAt: string;
	thumbnails?: youtube_v3.Schema$ThumbnailDetails;
	channelThumbnails?: youtube_v3.Schema$ThumbnailDetails;
}

export interface Category {
	id: string;
	title: string;
	backgroundColor: string;
	fallbackThumbnailColor: string;
	thumbnails?: youtube_v3.Schema$ThumbnailDetails;
}

export interface Palette {
	Vibrant: Swatch | null;
	Muted: Swatch | null;
	DarkVibrant: Swatch | null;
	DarkMuted: Swatch | null;
	LightVibrant: Swatch | null;
	LightMuted: Swatch | null;
	[name: string]: Swatch | null;
}

interface Swatch {
	_rgb: number[];
	_population: number;
	_hsl?: number[];
}

export interface VideoInfo {
	id: string;
	url: string;
	formats: videoFormat[];
	videoDetails: VideoDetails;
	videoColors: WatchViewColors;
}

export interface VideoDetails {
	title: string;
	description: string | null;
	author: {
		name: string;
		id: string;
	};
	duration: number;
	keywords: string[];
	chapters: Chapter[];
}

export interface WatchViewColors {
	primaryBackground: number[] | null;
	secondaryBackground: number[] | null;
}
