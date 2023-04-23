import Link from 'next/link';
import { getCategories } from '@/lib/youtube';
import { getBestThumbnail } from 'utils';
import vodifaiLogoUrl from '@/public/vodifai-logo.svg?url';
import Image from 'next/image';
import styles from './categories.module.scss';

export const DEFAULT_FALLBACK_THUMBNAIL_COLOR = '#FF0000';

export const categoryColors = [
	'rgb(20, 138, 8)',
	'rgb(141, 103, 171)',
	'rgb(240, 55, 165)',
	'rgb(39, 133, 106)',
	'rgb(232, 17, 91)',
	'rgb(30, 50, 100)',
	'rgb(180, 155, 200)',
	'rgb(65, 0, 245)',
	'rgb(230, 30, 50)',
	'rgb(165, 103, 82)',
	'rgb(186, 93, 7)',
];

export async function Categories() {
	const categories = await getCategories();

	return !categories.length ? null : (
		<>
			<h2 className={styles.browseAllHeader}>{'Browse all'}</h2>
			<div className={styles.categoriesContainer}>
				{categories.map(
					({
						id,
						title,
						backgroundColor,
						thumbnails,
						fallbackThumbnailColor,
					}) => {
						const videoThumbnail = getBestThumbnail(thumbnails);

						return (
							<Link
								key={id}
								className={styles.categoryItem}
								style={{ backgroundColor }}
								href={`/browse/${id}`}
							>
								<div className={styles.categoryText}>{title}</div>
								{!videoThumbnail ? (
									<div
										className={styles.categoryThumbnailFallback}
										style={{ backgroundColor: fallbackThumbnailColor }}
									>
										<Image alt={''} src={vodifaiLogoUrl} />
									</div>
								) : (
									<Image
										className={styles.categoryThumbnail}
										src={videoThumbnail.url}
										alt={title}
										width={videoThumbnail.width}
										height={videoThumbnail.height}
										unoptimized
									/>
								)}
							</Link>
						);
					}
				)}
			</div>
		</>
	);
}
