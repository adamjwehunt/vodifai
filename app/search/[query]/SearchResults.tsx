import { SearchItem } from './SearchItem';
import styles from './search.module.scss';
import { formatDate, formatDuration, formatViewCount } from './util';

const API_KEY = process.env.YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3/search';
export interface SearchResult {
	videoId: string;
	title: string;
	channelTitle: string;
	viewCount: number;
	videoLength: number;
	publishedAt: string;
	thumbnails: {
		default: Thumbnail;
		medium: Thumbnail;
		high: Thumbnail;
	};
	channelThumbnails: {
		default: Thumbnail;
		medium: Thumbnail;
		high: Thumbnail;
	};
}

export interface Thumbnail {
	url: string;
	width: number;
	height: number;
}

async function searchVideos(query: string): Promise<SearchResult[]> {
	if (!API_KEY) {
		throw new Error('Missing env var from Youtube');
	}

	const params = new URLSearchParams({
		part: 'snippet',
		q: query,
		type: 'video',
		key: API_KEY,
		maxResults: '30',
	});
	const response = await fetch(`${BASE_URL}?${params.toString()}`);

	const data = await response.json();
	const videoIds = data.items.map((item: any) => item.id.videoId).join(',');
	const videoParams = new URLSearchParams({
		part: 'snippet,statistics,contentDetails',
		id: videoIds,
		key: API_KEY,
	});
	const videoResponse = await fetch(
		`https://www.googleapis.com/youtube/v3/videos?${videoParams.toString()}`
	);

	const videoData = await videoResponse.json();
	const channelIds = videoData.items
		.map((item: any) => item.snippet.channelId)
		.join(',');
	const channelParams = new URLSearchParams({
		part: 'snippet',
		id: channelIds,
		key: API_KEY,
	});
	const channelResponse = await fetch(
		`https://www.googleapis.com/youtube/v3/channels?${channelParams.toString()}`
	);
	const channelData = await channelResponse.json();

	return videoData.items.map((item: any) => {
		const channel = channelData.items.find(
			(channel: any) => channel.id === item.snippet.channelId
		);

		return {
			videoId: item.id,
			title: item.snippet.title,
			channelTitle: item.snippet.channelTitle,
			viewCount: formatViewCount(item.statistics.viewCount),
			videoLength: formatDuration(item.contentDetails.duration),
			publishedAt: formatDate(item.snippet.publishedAt),
			thumbnails: item.snippet.thumbnails,
			channelThumbnails: channel.snippet.thumbnails,
		};
	});
}
interface SearchResultsProps {
	query: string;
}

export const SearchResults = async ({ query }: SearchResultsProps) => {
	const videos = await searchVideos(query);

	return (
		<div className={styles.searchResults}>
			{videos.map((video) => (
				<SearchItem key={video.videoId} video={video} />
			))}
		</div>
	);
};
