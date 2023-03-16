import { searchVideos } from 'app/api/youtube';
import { SearchItem } from '../../components/SearchItem';
import { getSearchResultsBackgroundImage } from 'app/util';
import { VideoResults } from 'app/components/VideoResults';

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
		<VideoResults backgroundImage={backgroundImage}>
			{videos.map((video) => (
				<SearchItem key={video.videoId} video={video} />
			))}
		</VideoResults>
	);
};
