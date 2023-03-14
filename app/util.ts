import { youtube_v3 } from 'googleapis';
import { Palette, WatchViewColors } from './types';
import { DateTime } from 'luxon';
import sharp from 'sharp';
import Vibrant from 'node-vibrant';

export function formatPublishedAtDate(dateString: string): string {
	const date = DateTime.fromISO(dateString);
	const now = DateTime.local();
	const elapsed = now
		.diff(date, [
			'years',
			'months',
			'weeks',
			'days',
			'hours',
			'minutes',
			'seconds',
		])
		.toObject();

	if (elapsed.years !== 0) {
		return `${elapsed.years} ${elapsed.years === 1 ? 'year' : 'years'} ago`;
	} else if (elapsed.months !== 0) {
		return `${elapsed.months} ${elapsed.months === 1 ? 'month' : 'months'} ago`;
	} else if (elapsed.weeks !== 0) {
		return `${elapsed.weeks} ${elapsed.weeks === 1 ? 'week' : 'weeks'} ago`;
	} else if (elapsed.days !== 0) {
		return `${elapsed.days} ${elapsed.days === 1 ? 'day' : 'days'} ago`;
	} else if (elapsed.hours !== 0) {
		return `${elapsed.hours} ${elapsed.hours === 1 ? 'hour' : 'hours'} ago`;
	} else if (elapsed.minutes !== 0) {
		return `${elapsed.minutes} ${
			elapsed.minutes === 1 ? 'minute' : 'minutes'
		} ago`;
	} else {
		return `${elapsed.seconds} ${
			elapsed.seconds === 1 ? 'second' : 'seconds'
		} ago`;
	}
}

export function formatViewCount(viewCount: number): string {
	let formattedCount: string;

	switch (true) {
		case viewCount < 1_000:
			formattedCount = `${viewCount} views`;
			break;
		case viewCount < 1_000_000:
			formattedCount = `${(viewCount / 1_000).toFixed(
				viewCount < 10_000 ? 1 : 0
			)}k views`;
			break;
		case viewCount < 1_000_000_000:
			formattedCount = `${(viewCount / 1_000_000).toFixed(
				viewCount < 10_000_000 ? 1 : 0
			)}M views`;
			break;
		case viewCount < 1_000_000_000_000:
			formattedCount = `${(viewCount / 1_000_000_000).toFixed(
				viewCount < 10_000_000_000 ? 1 : 0
			)}B views`;
			break;
		default:
			formattedCount = `${(viewCount / 1_000_000_000_000).toFixed(
				viewCount < 10_000_000_000_000 ? 1 : 0
			)}T views`;
			break;
	}

	return formattedCount;
}

export function formatDuration(duration: string): string {
	const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
	if (!match) {
		return '';
	}

	const hours = parseInt(match[1]?.slice(0, -1) || '0');
	const minutes = parseInt(match[2]?.slice(0, -1) || '0');
	const seconds = parseInt(match[3]?.slice(0, -1) || '0');

	const hourStr = hours > 0 ? `${hours}:` : '';
	const minuteStr = hours > 0 && minutes < 10 ? `0${minutes}:` : `${minutes}:`;
	const secondStr = seconds < 10 ? `0${seconds}` : `${seconds}`;

	return `${hourStr}${minuteStr}${secondStr}`;
}

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
		return {
			url: '',
			width: 0,
			height: 0,
		};
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

export async function generateComplimentaryColor(
	color: string
): Promise<string | undefined> {
	try {
		const thumbnailBuffer: Buffer = await sharp({
			create: {
				width: 3,
				height: 3,
				channels: 3,
				background: color,
			},
		})
			.toFormat('png')
			.toBuffer();

		const vibrant: Vibrant = new Vibrant(thumbnailBuffer);
		const palette: any = await vibrant.getPalette();
		const colors = extractColors(palette);
		const newColor = getBestColor(colors, [
			'darkVibrant',
			'darkMuted',
			'muted',
			'vibrant',
		]);

		if (!newColor) {
			return;
		}
		return rgbArrayToString(newColor);
	} catch (error) {
		return;
	}
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
	const backgroundImage = `linear-gradient(150deg,#999 0,#000 200px)`;

	const firstVideoColors = await getVideoColors(thumbnails);
	const browseResultsBackground =
		getWatchViewColors(firstVideoColors).secondaryBackground;

	if (!browseResultsBackground) {
		return backgroundImage;
	}

	return `linear-gradient(150deg,${rgbArrayToString(
		browseResultsBackground
	)} 0,#000 200px)`;
}
