import { rgbArrayToString } from 'app/utils';
import { youtube_v3 } from 'googleapis';

export function getBestSizedThumbnail(
	thumbnails: youtube_v3.Schema$ThumbnailDetails,
	width: number
): youtube_v3.Schema$Thumbnail | undefined {
	const thumbnailArray = Object.values(thumbnails);
	let bestThumbnail: youtube_v3.Schema$Thumbnail | undefined;
	let bestDifference = Number.MAX_SAFE_INTEGER;

	thumbnailArray.forEach((thumbnail) => {
		if (thumbnail.width && thumbnail.width >= width) {
			const difference = Math.abs(thumbnail.width - width);

			if (difference < bestDifference) {
				bestDifference = difference;
				bestThumbnail = thumbnail;
			}
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
