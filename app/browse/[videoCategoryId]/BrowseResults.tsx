import { getVideosByCategory, searchVideos } from 'utils/youtubeApi';
import { SearchItem } from './SearchItem';
import styles from 'app/page.module.scss';

interface BrowseResultsProps {
	videoCategoryId: string;
	categoryName: string;
}

export const BrowseResults = async ({
	videoCategoryId,
	categoryName,
}: BrowseResultsProps) => {
	let videos = await getVideosByCategory(videoCategoryId);

	if (!videos.length) {
		videos = await searchVideos(categoryName);
	}

	return !videos.length ? null : (
		<div className={styles.searchResults}>
			{videos.map((video) => (
				<SearchItem key={video.videoId} video={video} />
			))}
		</div>
	);
};
