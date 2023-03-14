import Link from 'next/link';
import SearchIcon from '@/public/search-icon.svg';
import { Categories } from './Categories';
import styles from './page.module.scss';

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
			{/* @ts-expect-error Server Component */}
			<Categories />
		</div>
	);
}
