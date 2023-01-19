import Link from 'next/link';
import { Categories } from './Categories';
import styles from './page.module.css';
import SearchIcon from '@/public/search-icon.svg';

export default async function Home() {
	return (
		<div className={styles.browseWrapper}>
			<h1 className={styles.browseHeader}>{'Search'}</h1>
			<Link href="/search">
				<button className={styles.searchButton}>
					<SearchIcon className={styles.searchIcon} />
					<div className={styles.searchButtonText}>
						{'What do you want to watch?'}
					</div>
				</button>
			</Link>

			<h2 className={styles.browseAllHeader}>{'Browse all'}</h2>
			<Categories />
		</div>
	);
}
