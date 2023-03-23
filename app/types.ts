import { youtube_v3 } from 'googleapis';
import { videoFormat } from 'ytdl-core';

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

export interface Caption {
	id: number;
	start: number;
	duration: number;
	text: string;
}

export interface Chapter {
	title: string;
	start_time: number;
}

export interface ChapterWithCaptions extends Chapter {
	captions: Caption[];
}

interface VideoFormat {
	itag: number;
	container: string;
	qualityLabel: string;
	bitrate?: number;
	type?: string;
	contentLength: string;
}

export interface Download {
	format: VideoFormat;
	url: string;
}

export interface Downloads {
	videoFormats: Download[];
	audioFormats: Download[];
}

export interface OpenAIStreamPayload {
	model: string;
	prompt: string;
	temperature: number;
	top_p: number;
	frequency_penalty: number;
	presence_penalty: number;
	max_tokens: number;
	stream: boolean;
	n: number;
}
