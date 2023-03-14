import { getVideosByCategory, searchVideos } from 'utils/youtubeApi';
import { SearchItem } from './SearchItem';
import styles from 'app/page.module.scss';
import { getSearchResultsBackgroundImage } from 'app/util';
import { VideoResults } from 'app/VideoResults';

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

	if (!videos.length) {
		return null;
	}

	const backgroundImage = await getSearchResultsBackgroundImage(
		videos[0].thumbnails
	);

	return (
		<VideoResults backgroundImage={backgroundImage} isVisible={!!videos.length}>
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
