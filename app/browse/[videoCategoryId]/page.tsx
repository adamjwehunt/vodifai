import {
	getCategoryTitle,
	getVideosByCategory,
	searchVideos,
} from 'app/externalApi/youtube';
import { getSearchResultsBackgroundImage } from 'app/utils';
import { VideoResults } from 'app/components/VideoResults';
import { SearchItem } from 'app/components/SearchItem';
import styles from 'app/page.module.scss';

interface BrowseProps {
	params: { videoCategoryId: string };
}

export default async function BrowsePage({
	params: { videoCategoryId },
}: BrowseProps) {
	let [videos, categoryName] = await Promise.all([
		getVideosByCategory(videoCategoryId),
		getCategoryTitle(videoCategoryId),
	]);

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
}
