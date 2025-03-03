import { searchVideos } from '@/lib/youtube';
import { SearchItem } from '@/components/SearchItem';
import { VideoResults } from '@/components/VideoResults';
import { getSearchResultsBackgroundImage } from 'utils';
import styles from '@/app/page.module.scss';

interface SearchProps {
	params: Promise<{ query: string }>;
}

export default async function Search({ params }: SearchProps) {
	const { query } = await params;
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
