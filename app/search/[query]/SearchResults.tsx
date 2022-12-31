import React from 'react';

async function getVideos(query: string) {
	if (!query) {
		return [];
	}

	const res = await fetch(
		`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${query}&type=video&key=${process.env.YOUTUBE_API_KEY}`
	);

	return res.json();
}

export default async function SearchResults({ query }: { query: string }) {
	const videos = await getVideos(query);
	console.log(
		`app/search/[query]/SearchResults.tsx - 17 => videos: `,
		'\n',
		videos
	);

	return <div>{query}</div>;
}
