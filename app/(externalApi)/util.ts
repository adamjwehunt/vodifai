import { extractColors, getBestColor, rgbArrayToString } from 'app/(utils)';
import { DateTime } from 'luxon';
import Vibrant from 'node-vibrant';
import sharp from 'sharp';

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
			'darkMuted',
			'darkVibrant',
			'vibrant',
			'muted',
		]);

		if (!newColor) {
			return;
		}
		return rgbArrayToString(newColor);
	} catch (error) {
		return;
	}
}

