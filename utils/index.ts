import { Palette, WatchViewColors } from '@/app/types';
import { youtube_v3 } from 'googleapis';
import Vibrant from 'node-vibrant';
import { thumbnail } from 'ytdl-core';

export function getBestColor(
	palette: {
		[key: string]: number[];
	},
	swatchNames: string[]
): number[] | null {
	for (const swatchName of swatchNames) {
		const swatch = palette[swatchName];

		if (swatch != null) {
			return swatch;
		}
	}

	return null;
}

//TODO: Use window size to find best thumbnail ("use client" only)
export function getBestThumbnail(
	thumbnails: youtube_v3.Schema$ThumbnailDetails | undefined
) {
	if (!thumbnails) {
		return undefined;
	}

	const bestThumbnail =
		thumbnails.high || thumbnails.medium || thumbnails.default;

	return {
		url: bestThumbnail?.url || '',
		width: bestThumbnail?.width || 0,
		height: bestThumbnail?.height || 0,
	};
}

export const rgbArrayToString = (rgb: number[]) => {
	return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
};

export function getWatchViewColors(rgbArray: {
	[key: string]: number[];
}): WatchViewColors {
	const colors: WatchViewColors = {
		primaryBackground: null,
		secondaryBackground: null,
	};

	colors.primaryBackground =
		getBestColor(rgbArray, ['darkVibrant', 'darkMuted', 'muted', 'vibrant']) ||
		null;

	colors.secondaryBackground =
		getBestColor(rgbArray, [
			'lightMuted',
			'lightVibrant',
			'muted',
			'vibrant',
		]) || null;

	return colors;
}

export async function getSearchResultsBackgroundImage(
	thumbnails: youtube_v3.Schema$ThumbnailDetails | undefined
) {
	const backgroundImage = `linear-gradient(150deg,#999 0,#000 12rem)`;

	const firstVideoColors = await getVideoColors(thumbnails);
	const browseResultsBackground =
		getWatchViewColors(firstVideoColors).secondaryBackground;

	if (!browseResultsBackground) {
		return backgroundImage;
	}

	return `linear-gradient(150deg,${rgbArrayToString(
		browseResultsBackground
	)} 0,#000 12rem)`;
}

export function mapThumbnailDetails(thumbnails: thumbnail[]) {
	const thumbnailDetails: { [key: string]: youtube_v3.Schema$Thumbnail } = {};

	for (const thumbnail of thumbnails) {
		if (thumbnail.width && thumbnail.height) {
			const size = `${thumbnail.width}x${thumbnail.height}`;
			thumbnailDetails[size] = {
				url: thumbnail.url,
				width: thumbnail.width,
				height: thumbnail.height,
			};
		}
	}

	return thumbnailDetails;
}

export async function getVideoColors(
	thumbnails: youtube_v3.Schema$ThumbnailDetails | undefined
): Promise<
	Partial<{ [key in keyof youtube_v3.Schema$ThumbnailDetails]: number[] }>
> {
	if (!thumbnails) {
		return {};
	}

	let videoColors: Partial<{
		[key in keyof youtube_v3.Schema$ThumbnailDetails]: number[];
	}> = {};

	if (thumbnails) {
		const smallestThumbnailUrl = getSmallestThumbnail(thumbnails).url;

		if (smallestThumbnailUrl) {
			const vibrant = new Vibrant(smallestThumbnailUrl.replace(/\?.*$/, ''));
			const palette: any = await vibrant.getPalette();

			videoColors = extractColors(palette);
		}
	}

	return videoColors;
}

function getSmallestThumbnail(
	thumbnails: youtube_v3.Schema$ThumbnailDetails
): youtube_v3.Schema$Thumbnail {
	const thumbnailArray = Object.values(thumbnails);
	let smallestThumbnail = thumbnailArray[0];
	let smallestResolution = Number.MAX_SAFE_INTEGER;

	thumbnailArray.forEach((thumbnail) => {
		const resolution = thumbnail.width! * thumbnail.height!;

		if (resolution < smallestResolution) {
			smallestResolution = resolution;
			smallestThumbnail = thumbnail;
		}
	});

	return smallestThumbnail;
}

export function extractColors(palette: Palette): { [key: string]: number[] } {
	const colors: { [key: string]: number[] } = {};

	Object.keys(palette).forEach((key) => {
		const color = palette[key];

		if (color != null) {
			const colorName = toCamelCase(key);

			colors[colorName] = color._rgb.map((n) => Math.round(n));
		}
	});

	return colors;
}

function toCamelCase(str: string) {
	let result = '';

	for (let i = 0; i < str.length; i++) {
		const char = str[i];

		if (i === 0) {
			result += char.toLowerCase();
		} else if (char === ' ') {
			result += str[i + 1].toUpperCase();
			i++;
		} else {
			result += char;
		}
	}

	return result;
}

export function getWatchViewBackground(rgb: number[] | null): string {
	return `linear-gradient(0deg, rgb(18, 18, 18) 10%, rgb(${
		!rgb ? '60, 60, 60' : rgb.join(',')
	}) 100%)`;
}

const fallBackTranscriptBackgroundColor = 'rgb(185, 153, 190)';

export function getTranscriptBackground(rgb: number[] | null): string {
	return !rgb ? fallBackTranscriptBackgroundColor : rgbArrayToString(rgb);
}
