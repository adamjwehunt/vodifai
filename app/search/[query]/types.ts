interface YoutubeSearchItem {
	kind: string;
	etag: string;
	id: { kind: string; videoId: string; channelId: string; playlistId: string };
	snippet: YoutubeSearchSnippet;
	channelTitle: string;
	liveBroadcastContent: string;
}

interface YoutubeSearchSnippet {
	publishedAt: string;
	channelId: string;
	title: string;
	description: string;
	thumbnails: any;
	channelTitle: string;
	liveBroadcastContent: string;
}

interface YoutubePageInfo {
	totalResults: number;
	resultsPerPage: number;
}

export interface YoutubeSearchResult {
	kind: string;
	etag: string;
	nextPageToken: string;
	regionCode: string;
	pageInfo: YoutubePageInfo;
	items: YoutubeSearchItem[];
}
