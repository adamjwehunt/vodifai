import Link from 'next/link';
import SearchIcon from '@/public/search-icon.svg';
import { Categories } from '@/components/Categories';
import { AboutButton } from '@/components/AboutButton';
import { SEARCH_BAR_PLACEHOLDER } from '@/constants/homepage';
import styles from './page.module.scss';

export default function Home() {
	return (
		<div className={styles.searchHeaderWrapper}>
			<div className={styles.searchHeaderContainer}>
				<h1 className={styles.searchHeader}>{'Search'}</h1>
				<div className={styles.aboutButton}>
					<AboutButton />
				</div>
			</div>
			<Link href="/search">
				<button className={styles.searchButton}>
					<SearchIcon className={styles.searchIcon} />
					<div className={styles.searchButtonText}>
						{SEARCH_BAR_PLACEHOLDER}
					</div>
				</button>
			</Link>
			<Categories />
		</div>
	);
}
