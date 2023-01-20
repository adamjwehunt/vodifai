import { BackButton } from './BackButton';
import ArrowIcon from '@/public/arrow-icon.svg';
import Link from 'next/link';
import SearchIcon from '@/public/search-icon.svg';
import { SearchInput } from './SearchInput';
import styles from './search.module.css';

interface SearchBarProps {
	query?: string;
	button?: boolean;
}

export const SearchBar = ({ query, button }: SearchBarProps) => (
	<div className={styles.searchBar}>
		<BackButton>
			<ArrowIcon className={styles.arrowIcon} />
		</BackButton>
		{button ? (
			<Link href={'/search'} className={styles.inputWrapper}>
				<SearchIcon className={styles.searchIcon} />
				<SearchInput noFocus />
			</Link>
		) : (
			<div className={styles.inputWrapper}>
				<SearchIcon className={styles.searchIcon} />
				<SearchInput query={query} />
			</div>
		)}
	</div>
);
