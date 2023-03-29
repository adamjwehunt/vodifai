import { SearchItem } from 'components/SearchItem';
import { VideoResults } from 'components/VideoResults';
import {
	getVideosByCategory,
	getCategoryTitle,
	searchVideos,
} from 'lib/youtube';
import { getSearchResultsBackgroundImage } from 'utils';
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
		videos = await searchVideos(
			categoryName.length ? categoryName : decodeURIComponent(videoCategoryId)
		);
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
				<div className={styles.searchItems}>
					{videos.map((video) => (
						<SearchItem key={video.videoId} video={video} />
					))}
				</div>
			</>
		</VideoResults>
	);
}
