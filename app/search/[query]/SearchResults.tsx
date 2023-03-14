import { searchVideos } from 'utils/youtubeApi';
import { SearchItem } from './SearchItem';
import styles from 'app/page.module.scss';

interface SearchResultsProps {
	query: string;
}

export const SearchResults = async ({ query }: SearchResultsProps) => {
	const videos = await searchVideos(query);

	return !videos.length ? null : (
		<div className={styles.searchResults}>
			{videos.map((video) => (
				<SearchItem key={video.videoId} video={video} />
			))}
		</div>
	);
};
