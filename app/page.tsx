import Link from 'next/link';
import SearchIcon from '@/public/search-icon.svg';
import { Categories } from './components/Categories';
import styles from './page.module.scss';

export const SEARCH_BAR_PLACEHOLDER = 'What do you want to watch?';

export default function Home() {
	return (
		<div className={styles.searchHeaderWrapper}>
			<h1 className={styles.searchHeader}>{'Search'}</h1>
			<Link href="/search">
				<button className={styles.searchButton}>
					<SearchIcon className={styles.searchIcon} />
					<div className={styles.searchButtonText}>
						{SEARCH_BAR_PLACEHOLDER}
					</div>
				</button>
			</Link>
			{/* @ts-expect-error Server Component */}
			<Categories />
		</div>
	);
}
