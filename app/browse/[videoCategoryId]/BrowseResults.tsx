import {
	getCategoryTitle,
	getVideosByCategory,
	searchVideos,
} from 'app/api/youtube';
import { getSearchResultsBackgroundImage } from 'app/util';
import { VideoResults } from 'app/components/VideoResults';
import { SearchItem } from './SearchItem';
import styles from 'app/page.module.scss';

interface BrowseResultsProps {
	videoCategoryId: string;
}

export const BrowseResults = async ({
	videoCategoryId,
}: BrowseResultsProps) => {
	const categoryName = await getCategoryTitle(videoCategoryId);

	let videos = await getVideosByCategory(videoCategoryId);
	if (!videos.length) {
		videos = await searchVideos(categoryName);
	}

	if (!videos.length) {
		return null;
	}

	const backgroundImage = await getSearchResultsBackgroundImage(
		videos[0].thumbnails
	);

	return (
		<VideoResults backgroundImage={backgroundImage}>
			<>
				{!categoryName ? null : (
					<div className={styles.categoryHeader}>{categoryName}</div>
				)}
				{videos.map((video) => (
					<SearchItem key={video.videoId} video={video} />
				))}
			</>
		</VideoResults>
	);
};
