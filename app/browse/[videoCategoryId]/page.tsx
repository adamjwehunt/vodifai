import { SearchItem } from '@/components/SearchItem';
import { VideoResults } from '@/components/VideoResults';
import {
	getVideosByCategory,
	getCategoryTitle,
	searchVideos,
} from '@/lib/youtube';
import { getSearchResultsBackgroundImage } from 'utils';
import styles from '@/app/page.module.scss';

export default async function BrowsePageProps({
	params,
}: {
	params: Promise<{ videoCategoryId: string }>;
}) {
	const { videoCategoryId } = await params;
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
				{categoryName ? (
					<div className={styles.categoryHeader}>{categoryName}</div>
				) : null}
				<div className={styles.searchItems}>
					{videos.map((video) => (
						<SearchItem key={video.videoId} video={video} />
					))}
				</div>
			</>
		</VideoResults>
	);
}
