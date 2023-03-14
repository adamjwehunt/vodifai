import { searchVideos } from 'utils/youtubeApi';
import { SearchItem } from './SearchItem';
import { getSearchResultsBackgroundImage } from 'app/util';
import { VideoResults } from 'app/VideoResults';

interface SearchResultsProps {
	query: string;
}

export const SearchResults = async ({ query }: SearchResultsProps) => {
	const videos = await searchVideos(query);

	if (!videos.length) {
		return null;
	}

	const backgroundImage = await getSearchResultsBackgroundImage(
		videos[0].thumbnails
	);

	return (
		<VideoResults backgroundImage={backgroundImage} isVisible={!!videos.length}>
			{videos.map((video) => (
				<SearchItem key={video.videoId} video={video} />
			))}
		</VideoResults>
	);
};
