import Link from 'next/link';
import ArrowIcon from '../../public/arrow-icon.svg';
import SearchIcon from '../../public/search-icon.svg';
import { SearchInput } from './SearchInput';
import styles from './search.module.css';

export default function SearchBar({ query }: { query: string }) {
	return (
		<div className={styles.searchBar}>
			<Link href="/">
				<button className={styles.arrowButton}>
					<ArrowIcon className={styles.arrowIcon} />
				</button>
			</Link>
			<div className={styles.inputWrapper}>
				<SearchIcon className={styles.searchIcon} />
				<SearchInput query={query} />
			</div>
		</div>
	);
}
