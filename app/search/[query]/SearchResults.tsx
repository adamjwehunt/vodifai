import Image from 'next/image';
import Link from 'next/link';
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

interface SearchResultsProps {
	query: string;
}

export default async function SearchResults({ query }: SearchResultsProps) {
	const videos = await getVideos(query);

	return (
		<div>
			{videos?.items.map((video) => {
				console.log(
					`app/search/[query]/SearchResults.tsx - 23 => video: `,
					'\n',
					video
				);
				return (
					<Link key={video.id.videoId} href={`/watch/${video.id.videoId}`}>
						<h3>{video.snippet.title}</h3>
						<p>{video.snippet.description}</p>
						<Image
							src={video.snippet.thumbnails.high.url}
							alt={video.snippet.title}
							width={video.snippet.thumbnails.high.width}
							height={video.snippet.thumbnails.high.height}
						/>
					</Link>
				);
			})}
		</div>
	);
}
