import { thumbnail } from 'ytdl-core';
import Vibrant from 'node-vibrant';
import { Palette, WatchViewColors } from './types';

function getSmallestThumbnail(thumbnails: thumbnail[]) {
	let smallestThumbnail = thumbnails[0];
	let smallestResolution = Number.MAX_SAFE_INTEGER;

	thumbnails.forEach((thumbnail) => {
		const resolution = thumbnail.width * thumbnail.height;

		if (resolution < smallestResolution) {
			smallestResolution = resolution;
			smallestThumbnail = thumbnail;
		}
	});

	return smallestThumbnail;
}

export function getBestSizedThumbnail(thumbnails: thumbnail[], width: number) {
	let bestThumbnail = thumbnails[0];
	let bestDifference = Number.MAX_SAFE_INTEGER;

	thumbnails.forEach((thumbnail) => {
		const difference = Math.abs(thumbnail.width - width);

		if (difference < bestDifference && thumbnail.width >= width) {
			bestDifference = difference;
			bestThumbnail = thumbnail;
		}
	});

	return bestThumbnail;
}

export async function getVideoColors(
	thumbnails: thumbnail[]
): Promise<{ [key: string]: number[] }> {
	let videoColors = {};

	if (thumbnails) {
		const smallestThumbnailUrl = getSmallestThumbnail(thumbnails).url;

		if (smallestThumbnailUrl) {
			const v = new Vibrant(smallestThumbnailUrl.replace(/\?.*$/, ''));
			const palette: any = await v.getPalette();

			videoColors = extractColors(palette);
		}
	}

	return videoColors;
}

function extractColors(palette: Palette): { [key: string]: number[] } {
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

function getBestColor(
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
['vibrant', 'lightVibrant', 'muted', 'lightMuted'];
export function getWatchViewBackground(rgb: number[] | null): string {
	return `linear-gradient(0deg, rgb(18, 18, 18) 10%, rgb(${
		!rgb ? '60, 60, 60' : rgb.join(',')
	}) 100%)`;
}

const fallBackTranscriptBackgroundColor = 'rgb(185, 153, 190)';

export function getTranscriptBackground(rgb: number[] | null): string {
	return !rgb
		? fallBackTranscriptBackgroundColor
		: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}
