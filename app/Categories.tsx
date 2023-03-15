import { getCategories } from './api/youtube';
import Link from 'next/link';
import styles from './page.module.scss';

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

export const Categories = async () => {
	const categories = await getCategories();

	return !categories.length ? null : (
		<>
			<h2 className={styles.browseAllHeader}>{'Browse all'}</h2>
			<div className={styles.categoriesContainer}>
				{categories.map(({ id, title, backgroundColor }) => (
					<Link
						key={id}
						className={styles.category}
						style={{ backgroundColor }}
						href={`/browse/${id}`}
					>
						<div className={styles.categoryText}>{title}</div>
					</Link>
				))}
			</div>
		</>
	);
};
