import { rgbArrayToString } from 'app/(utils)';

export function getWatchViewBackground(rgb: number[] | null): string {
	return `linear-gradient(0deg, rgb(18, 18, 18) 10%, rgb(${
		!rgb ? '60, 60, 60' : rgb.join(',')
	}) 100%)`;
}

const fallBackTranscriptBackgroundColor = 'rgb(185, 153, 190)';

export function getTranscriptBackground(rgb: number[] | null): string {
	return !rgb ? fallBackTranscriptBackgroundColor : rgbArrayToString(rgb);
}
