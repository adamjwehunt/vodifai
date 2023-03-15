import { youtube_v3 } from 'googleapis';
import {
	categoryColors,
	DEFAULT_FALLBACK_THUMBNAIL_COLOR,
} from '../Categories';
import { Category, SearchResult } from '../types';
import {
	formatViewCount,
	formatDuration,
	formatPublishedAtDate,
	generateComplimentaryColor,
} from '../util';

const BASE_YOUTUBE_URL = 'https://youtube.googleapis.com/youtube/v3';

export async function getCategories(): Promise<Category[]> {
	const params = new URLSearchParams({
		part: 'snippet',
		regionCode: 'US',
		key: getYoutubeApiKey(),
	});
	const url = `${BASE_YOUTUBE_URL}/videoCategories?${params.toString()}`;
	try {
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error('Unable to fetch categories from YouTube API.');
		}

		const categoryJson: youtube_v3.Schema$VideoCategoryListResponse =
			await response.json();

		if (!categoryJson.items?.length) {
			console.warn('No categories found.');
			return [];
		}

		return await mapCategoryDataToCategories(categoryJson.items);
	} catch (error) {
		console.error(error);
		return [];
	}
}

export async function getCategoryTitle(categoryId: string) {
	const params = new URLSearchParams({
		part: 'snippet',
		id: categoryId,
		key: getYoutubeApiKey(),
	});
	const url = `${BASE_YOUTUBE_URL}/videoCategories?${params.toString()}`;

	try {
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error('Unable to fetch category name from YouTube API.');
		}

		const categoryJson: youtube_v3.Schema$VideoCategoryListResponse =
			await response.json();
		const categoryTitle = categoryJson.items?.[0]?.snippet?.title;

		if (!categoryTitle) {
			console.warn('No category name found.');
			return '';
		}

		return categoryTitle;
	} catch (error) {
		console.error(error);
		return '';
	}
}

export async function getVideosByCategory(categoryId: string) {
	const params = new URLSearchParams({
		part: 'snippet,statistics,contentDetails',
		chart: 'mostPopular',
		regionCode: 'US',
		videoCategoryId: categoryId,
		maxResults: '30',
		key: getYoutubeApiKey(),
	});
	const url = `${BASE_YOUTUBE_URL}/videos?${params.toString()}`;

	try {
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(
				'YouTube API: Unable to fetch videos by category, Attempting to fetch videos by search using category title.'
			);
		}

		const videoJson: youtube_v3.Schema$VideoListResponse =
			await response.json();

		if (!videoJson.items?.length) {
			console.warn('No videos found.');
			return [];
		}

		return await mapVideoDataToSearchResults(videoJson.items);
	} catch (error) {
		console.error(error);
		return [];
	}
}

export async function searchVideos(query: string) {
	const searchParams = new URLSearchParams({
		part: 'snippet',
		q: query,
		type: 'video',
		maxResults: '30',
		key: getYoutubeApiKey(),
	});
	const searchUrl = `${BASE_YOUTUBE_URL}/search?${searchParams.toString()}`;

	try {
		const searchResponse = await fetch(searchUrl);

		if (!searchResponse.ok) {
			throw new Error('Unable to fetch search results from YouTube API.');
		}

		const searchJson: youtube_v3.Schema$SearchListResponse =
			await searchResponse.json();
		const videoIds = searchJson.items
			?.map((item: youtube_v3.Schema$SearchResult) => item.id?.videoId)
			.filter(Boolean)
			.join(',');

		if (!videoIds) {
			console.warn('No videoIds found.');
			return [];
		}

		const videosParams = new URLSearchParams({
			part: 'snippet,statistics,contentDetails',
			id: videoIds,
			key: getYoutubeApiKey(),
		});
		const videoUrl = `${BASE_YOUTUBE_URL}/videos?${videosParams.toString()}`;

		const videoResponse = await fetch(videoUrl);

		if (!videoResponse.ok) {
			throw new Error('Unable to fetch video data from YouTube API.');
		}

		const videoJson: youtube_v3.Schema$VideoListResponse =
			await videoResponse.json();

		if (!videoJson.items?.length) {
			console.warn('No videos found.');
			return [];
		}

		return await mapVideoDataToSearchResults(videoJson.items);
	} catch (err) {
		console.error(err);
		return [];
	}
}

async function mapVideoDataToSearchResults(
	videoData: youtube_v3.Schema$Video[]
) {
	const searchResults: SearchResult[] = [];

	const channelIds = videoData
		?.map((item: youtube_v3.Schema$Video) => item.snippet?.channelId)
		.filter(Boolean)
		.join(',');

	const channels = await getChannels(channelIds);

	videoData.forEach((video) => {
		const { id: videoId, snippet, contentDetails, statistics } = video;
		if (!videoId || !snippet || !contentDetails || !statistics) {
			return;
		}
		const { title, channelTitle, publishedAt, thumbnails, channelId } = snippet;
		if (!title || !channelTitle || !publishedAt || !thumbnails || !channelId) {
			return;
		}

		const result: SearchResult = {
			videoId,
			title,
			channelTitle,
			viewCount: formatViewCount(Number(statistics.viewCount)),
			videoLength: formatDuration(contentDetails.duration ?? ''),
			publishedAt: formatPublishedAtDate(publishedAt),
			thumbnails,
			channelThumbnails: channels.find((channel) => channel.id === channelId)
				?.snippet?.thumbnails,
		};

		searchResults.push(result);
	});

	return searchResults;
}

async function getChannels(channelIds: string) {
	if (!channelIds) {
		console.warn('No channelIds found.');
		return [];
	}

	const params = new URLSearchParams({
		part: 'snippet',
		id: channelIds,
		key: getYoutubeApiKey(),
	});
	const url = `${BASE_YOUTUBE_URL}/channels?${params.toString()}`;

	try {
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error('Unable to fetch channel data from YouTube API.');
		}

		const channelJson: youtube_v3.Schema$ChannelListResponse =
			await response.json();

		if (!channelJson.items?.length) {
			console.warn('No channels found.');
			return [];
		}

		return channelJson.items;
	} catch (error) {
		console.error(error);
		return [];
	}
}

async function mapCategoryDataToCategories(
	videoCategories: youtube_v3.Schema$VideoCategory[]
) {
	let categories: Category[] = [];

	categories = videoCategories
		.map((category) => {
			if (!category.id || !category.snippet?.title) {
				console.error(`Category has no id or title: ${category}`);
				return null;
			}

			return {
				id: category.id,
				title: category.snippet?.title,
				backgroundColor:
					categoryColors[
						videoCategories.indexOf(category) % categoryColors.length
					],
			};
		})
		.filter((category) => category !== null) as Category[];

	categories = await mapCategoryThumbnailsOrFallBackThumbnailColor(categories);

	return categories;
}

async function mapCategoryThumbnailsOrFallBackThumbnailColor(
	categories: Category[]
) {
	const categoryPromises = categories.map(async (category) => {
		const newCategory = { ...category };

		try {
			const thumbnails = await getCategoryThumbnails(category.id);

			if (thumbnails) {
				newCategory.thumbnails = thumbnails;
			}
		} catch (err) {
			console.error(err);
		}

		if (!newCategory.thumbnails) {
			const complementaryColor = await generateComplimentaryColor(
				category.backgroundColor
			);

			newCategory.fallbackThumbnailColor =
				complementaryColor ?? DEFAULT_FALLBACK_THUMBNAIL_COLOR;
		}

		return newCategory;
	});

	return await Promise.all(categoryPromises);
}

async function getCategoryThumbnails(categoryId: string) {
	const urlParams = new URLSearchParams({
		part: 'snippet',
		chart: 'mostPopular',
		regionCode: 'US',
		videoCategoryId: categoryId,
		maxResults: '1',
		key: getYoutubeApiKey(),
	});
	const fetchVideoUrl = `${BASE_YOUTUBE_URL}/videos?${urlParams.toString()}`;

	try {
		const videoResponse = await fetch(fetchVideoUrl);

		if (!videoResponse.ok) {
			throw new Error(
				`Unable to fetch video from category ${categoryId} from YouTube API.`
			);
		}

		const videoJson: youtube_v3.Schema$VideoListResponse =
			await videoResponse.json();

		if (!videoJson.items?.length) {
			console.warn('No videos found.');
			return undefined;
		}

		const channelId = videoJson.items[0].snippet?.channelId;

		if (!channelId) {
			console.warn('No channelId found.');
			return undefined;
		}

		const channelParams = new URLSearchParams({
			part: 'snippet',
			id: channelId,
			key: getYoutubeApiKey(),
		});
		const url = `${BASE_YOUTUBE_URL}/channels?${channelParams.toString()}`;

		const channelResponse = await fetch(url);

		if (!channelResponse.ok) {
			throw new Error(
				`Unable to fetch channel ${channelId} of first video ${videoJson.items[0].id} of category ${categoryId} from YouTube API.`
			);
		}

		const channelJson: youtube_v3.Schema$ChannelListResponse =
			await channelResponse.json();

		if (!channelJson.items?.length) {
			console.warn('No channels found.');
			return undefined;
		}

		const channel = channelJson.items[0];
		return channel?.snippet?.thumbnails;
	} catch (err) {
		return undefined;
	}
}

function getYoutubeApiKey(key = process.env.YOUTUBE_API_KEY): string {
	if (!key) {
		throw new Error(
			'No YouTube API key provided. Please set the YOUTUBE_API_KEY environment variable.'
		);
	}

	return key;
}
