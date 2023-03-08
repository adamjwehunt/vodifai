import { Thumbnail } from './SearchResults';

export function formatDate(dateString: string): string {
	const date = new Date(dateString);
	const now = new Date();
	const elapsedSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

	switch (true) {
		case elapsedSeconds < 60:
			return `${elapsedSeconds} seconds ago`;
		case elapsedSeconds < 3600:
			const minutes = Math.floor(elapsedSeconds / 60);
			return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
		case elapsedSeconds < 86400:
			const hours = Math.floor(elapsedSeconds / 3600);
			return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
		case elapsedSeconds < 604800:
			const days = Math.floor(elapsedSeconds / 86400);
			return `${days} ${days === 1 ? 'day' : 'days'} ago`;
		case elapsedSeconds < 2592000:
			const weeks = Math.floor(elapsedSeconds / 604800);
			return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
		case elapsedSeconds < 5184000:
			return `1 month ago`;
		case elapsedSeconds < 31536000:
			const months = Math.floor(elapsedSeconds / 2592000);
			return `${months} ${months === 1 ? 'month' : 'months'} ago`;
		case elapsedSeconds >= 31536000 && elapsedSeconds < 63072000:
			return `1 year ago`;
		default:
			const years = Math.floor(elapsedSeconds / 31536000);
			return `${years} ${years === 1 ? 'year' : 'years'} ago`;
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

export function getBestThumbnail(thumbnails: {
	default: Thumbnail;
	medium: Thumbnail;
	high: Thumbnail;
}) {
	if (thumbnails.high) {
		return {
			url: thumbnails.high.url,
			width: thumbnails.high.width,
			height: thumbnails.high.height,
		};
	} else if (thumbnails.medium) {
		return {
			url: thumbnails.medium.url,
			width: thumbnails.medium.width,
			height: thumbnails.medium.height,
		};
	}
	return {
		url: thumbnails.default.url,
		width: thumbnails.default.width,
		height: thumbnails.default.height,
	};
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
