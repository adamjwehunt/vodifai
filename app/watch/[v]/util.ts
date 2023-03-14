import { thumbnail } from 'ytdl-core';
import { rgbArrayToString } from 'app/util';

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

export function getWatchViewBackground(rgb: number[] | null): string {
	return `linear-gradient(0deg, rgb(18, 18, 18) 10%, rgb(${
		!rgb ? '60, 60, 60' : rgb.join(',')
	}) 100%)`;
}

const fallBackTranscriptBackgroundColor = 'rgb(185, 153, 190)';

export function getTranscriptBackground(rgb: number[] | null): string {
	return !rgb ? fallBackTranscriptBackgroundColor : rgbArrayToString(rgb);
}
