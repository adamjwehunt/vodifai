import Image from 'next/image';
import { YoutubeSearchResult } from './types';

async function getVideos(query: string): Promise<YoutubeSearchResult | null> {
	if (!query) {
		return null;
	}

	const res = await fetch(
		`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${query}&type=video&key=${process.env.YOUTUBE_API_KEY}`
	);

	return res.json();
}

export default async function SearchResults({ query }: { query: string }) {
	const videos = await getVideos(query);

	return (
		<div>
			{videos?.items.map((video) => {
				return (
					<div key={video.id.videoId}>
						<h3>{video.snippet.title}</h3>
						<p>{video.snippet.description}</p>
						<Image
							src={video.snippet.thumbnails.high.url}
							alt={video.snippet.title}
							width={video.snippet.thumbnails.high.width}
							height={video.snippet.thumbnails.high.height}
						/>
					</div>
				);
			})}
		</div>
	);
}
