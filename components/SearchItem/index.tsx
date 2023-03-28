import { SearchResult } from 'app/types';
import { getBestThumbnail } from 'utils';
import Link from 'next/link';
import Image from 'next/image';
import styles from './searchItem.module.scss';

export const SearchItem = ({
	video: {
		videoId,
		title,
		thumbnails,
		channelThumbnails,
		channelTitle,
		viewCount,
		publishedAt,
		videoLength,
	},
}: {
	video: SearchResult;
}) => {
	const Divider = () => <span>{' • '}</span>;

	const videoThumbnail = getBestThumbnail(thumbnails);
	const channelThumbnail = getBestThumbnail(channelThumbnails);

	return (
		<Link
			key={videoId}
			className={styles.searchItemContainer}
			href={`/watch/${videoId}`}
		>
			<div className={styles.imageContainer}>
				<div className={styles.imageWrapper}>
					{!videoThumbnail ? null : (
						<Image
							className={styles.image}
							src={videoThumbnail.url}
							alt={title}
							width={videoThumbnail.width}
							height={videoThumbnail.height}
						/>
					)}
				</div>
				<div className={styles.videoTime}>{videoLength}</div>
			</div>
			<div className={styles.searchItemDetails}>
				<div className={styles.channelIcon}>
					{!channelThumbnail ? null : (
						<Image
							src={channelThumbnail.url}
							alt={title}
							width={channelThumbnail.width}
							height={channelThumbnail.height}
						/>
					)}
				</div>
				<div className={styles.videoInfo}>
					<h3 className={styles.title}>{title}</h3>
					<div className={styles.details}>
						<span>{channelTitle}</span>
						<Divider />
						<span>{viewCount}</span>
						<Divider />
						<span>{publishedAt}</span>
					</div>
				</div>
			</div>
		</Link>
	);
};
