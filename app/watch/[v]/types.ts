import { videoFormat } from 'ytdl-core';

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
	videoColors: WatchViewColors;
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

export interface WatchViewColors {
	primaryBackground: number[] | null;
	secondaryBackground: number[] | null;
}
