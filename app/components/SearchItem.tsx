import { SearchResult } from 'app/types';
import { getBestThumbnail } from 'app/utils';
import Link from 'next/link';
import Image from 'next/image';
import styles from 'app/page.module.scss';

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

	const { url, width, height } = getBestThumbnail(thumbnails);
	const {
		url: channelUrl,
		width: channelWidth,
		height: channelHeight,
	} = getBestThumbnail(channelThumbnails);

	return (
		<Link
			key={videoId}
			className={styles.searchItemContainer}
			href={`/watch/${videoId}`}
		>
			<div className={styles.imageContainer}>
				<div className={styles.imageWrapper}>
					<Image
						className={styles.image}
						src={url}
						alt={title}
						width={width}
						height={height}
					/>
				</div>
				<div className={styles.videoTime}>{videoLength}</div>
			</div>
			<div className={styles.searchItemDetails}>
				<div className={styles.channelIcon}>
					<Image
						src={channelUrl}
						alt={title}
						width={channelWidth}
						height={channelHeight}
					/>
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
