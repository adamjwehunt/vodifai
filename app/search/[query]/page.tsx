import { searchVideos } from 'app/(externalApi)/youtube';
import { SearchItem } from 'app/(components)/SearchItem';
import { VideoResults } from 'app/(components)/VideoResults';
import { getSearchResultsBackgroundImage } from 'app/(utils)';
import styles from 'app/page.module.scss';

interface SearchProps {
	params: { query: string };
}

export default async function Search({ params: { query } }: SearchProps) {
	const videos = await searchVideos(decodeURIComponent(query));

	if (!videos.length) {
		return null;
	}

	const backgroundImage = await getSearchResultsBackgroundImage(
		videos[0].thumbnails
	);

	return (
		<VideoResults backgroundImage={backgroundImage}>
			<div className={styles.searchItems}>
				{videos.map((video) => (
					<SearchItem key={video.videoId} video={video} />
				))}
			</div>
		</VideoResults>
	);
}
