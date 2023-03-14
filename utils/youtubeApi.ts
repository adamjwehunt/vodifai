import { google, youtube_v3 } from 'googleapis';
import ytdl, { captionTrack } from 'ytdl-core';
import { categoryColors, DEFAULT_FALLBACK_THUMBNAIL_COLOR } from '../app/Categories';
import { Category, SearchResult, VideoInfo } from '../app/types';
import {
	formatPublishedAtDate,
	formatDuration,
	formatViewCount,
	generateThumbnailColor,
	getVideoColors,
	getWatchViewColors,
} from '../app/util';

export function youtube() {
	const API_KEY = process.env.YOUTUBE_API_KEY;

	if (!API_KEY) {
		throw new Error('No YouTube API key provided from .env file.');
	}

	return google.youtube({
		version: 'v3',
		auth: API_KEY,
	});
}

export async function searchVideos(query: string): Promise<SearchResult[]> {
	let searchResults: SearchResult[] = [];

	let videoData: youtube_v3.Schema$VideoListResponse = {};
	try {
		const response = await youtube().search.list({
			part: ['snippet'],
			q: query,
			type: ['video'],
			maxResults: 30,
		});

		if (!response.data.items?.length) {
			return searchResults;
		}

		const videoIds = response.data.items
			?.map((item: youtube_v3.Schema$SearchResult) => item.id?.videoId)
			.filter(Boolean)
			.join(',');

		const videoResponse = await youtube().videos.list({
			part: ['snippet', 'statistics', 'contentDetails'],
			id: [videoIds],
		});

		videoData = videoResponse.data;
	} catch (err) {
		return searchResults;
	}

	searchResults = await mapVideoDataToSearchResults(videoData);

	return searchResults;
}

export async function getCategoryName(
	categoryId: string
): Promise<string | null | undefined> {
	let categoryName;

	try {
		const { data } = await youtube().videoCategories.list({
			part: ['snippet'],
			id: [categoryId],
		});

		categoryName = data.items?.[0]?.snippet?.title;
	} catch (error) {
		categoryName = null;
	}

	return categoryName;
}

export async function getVideosByCategory(
	videoCategoryId: string
): Promise<SearchResult[]> {
	let searchResults: SearchResult[] = [];

	let videoData: youtube_v3.Schema$VideoListResponse = {};
	try {
		const videoResponse = await youtube().videos.list({
			part: ['snippet', 'statistics', 'contentDetails'],
			chart: 'mostPopular',
			regionCode: 'US',
			videoCategoryId,
			maxResults: 30,
		});

		videoData = videoResponse.data;
	} catch (error) {
		return searchResults;
	}

	searchResults = await mapVideoDataToSearchResults(videoData);

	return searchResults;
}

async function mapVideoDataToSearchResults(
	videoData: youtube_v3.Schema$VideoListResponse
) {
	const searchResults: SearchResult[] = [];

	if (!videoData.items?.length) {
		return searchResults;
	}

	const channelIds = videoData.items
		?.map((item: youtube_v3.Schema$Video) => item.snippet?.channelId)
		.filter(Boolean)
		.join(',');

	let channelData: youtube_v3.Schema$ChannelListResponse = {
		items: [],
	};

	if (channelIds?.length) {
		const { data } = await youtube().channels.list({
			part: ['snippet'],
			id: [channelIds],
		});

		channelData = data;
	}

	videoData.items.forEach((video) => {
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
			channelThumbnails: channelData?.items?.find(
				(channel) => channel.id === channelId
			)?.snippet?.thumbnails,
		};

		searchResults.push(result);
	});

	return searchResults;
}

export async function getCategories(): Promise<Category[]> {
	let categories: Category[] = [];

	let categoryData: youtube_v3.Schema$VideoCategoryListResponse = {};
	try {
		const res = await youtube().videoCategories.list({
			part: ['snippet'],
			regionCode: 'US',
		});

		categoryData = res.data;
	} catch (error) {
		console.error(error);
		return categories;
	}

	categories = await mapCategoryDataToCategories(categoryData);

	return categories;
}

async function mapCategoryDataToCategories(
	categoryData: youtube_v3.Schema$VideoCategoryListResponse
) {
	let categories: Category[] = [];

	const { items } = categoryData;
	if (!items?.length) {
		console.error('No categories found');
		return categories;
	}

	categories = items
		.map((category) => {
			if (!category.id || !category.snippet?.title) {
				console.error(`Category has no id or title: ${category}`);
				return null;
			}

			return {
				id: category.id,
				title: category.snippet?.title,
				backgroundColor:
					categoryColors[items.indexOf(category) % categoryColors.length],
				fallbackThumbnailColor: DEFAULT_FALLBACK_THUMBNAIL_COLOR,
			};
		})
		.filter((category) => category !== null) as Category[];

	categories = await getCategoryThumbnails(categories);

	return categories;
}

async function getCategoryThumbnails(categories: Category[]) {
	const categoryPromises = categories.map(async (category) => {
		const newCategory = { ...category };

		let noThumbnail = false;
		try {
			const videoResponse = await youtube().videos.list({
				part: ['snippet'],
				chart: 'mostPopular',
				regionCode: 'US',
				videoCategoryId: category.id,
				maxResults: 1,
			});

			const video = videoResponse.data.items?.[0];
			const channelId = video?.snippet?.channelId;

			if (channelId) {
				const channelResponse = await youtube().channels.list({
					part: ['snippet'],
					id: [channelId],
				});

				const channel = channelResponse.data.items?.[0];
				newCategory.thumbnails = channel?.snippet?.thumbnails;
			}
		} catch (err) {
			noThumbnail = true;
		}

		if (!noThumbnail) {
			const complementaryColor = await generateThumbnailColor(
				category.backgroundColor
			);

			if (complementaryColor) {
				newCategory.fallbackThumbnailColor = complementaryColor;
			}
		}

		return newCategory;
	});

	const result = await Promise.all(categoryPromises);

	return result;
}

export async function getVideoInfo(
	videoId: string
): Promise<{ videoInfo: VideoInfo; captionTracks: captionTrack[] }> {
	const info = await ytdl.getInfo(videoId);
	const videoColors = await getVideoColors(info.videoDetails.thumbnails);

	return {
		videoInfo: {
			id: videoId,
			url: `https://www.youtube.com/watch?v=${videoId}`,
			videoDetails: {
				author: {
					id: info.videoDetails.author.id,
					name: info.videoDetails.author.name,
				},
				description: info.videoDetails.description ?? '',
				title: info.videoDetails.title,
				duration: parseInt(info.videoDetails.lengthSeconds),
				keywords: info.videoDetails.keywords ?? [],
				chapters: info.videoDetails.chapters ?? [],
			},
			videoColors: getWatchViewColors(videoColors),
			formats: info.formats,
		},
		captionTracks:
			info.player_response.captions?.playerCaptionsTracklistRenderer
				.captionTracks || [],
	};
}

