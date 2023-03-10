import { BackButton } from './BackButton';
import ArrowIcon from '@/public/arrow-icon.svg';
import Link from 'next/link';
import SearchIcon from '@/public/search-icon.svg';
import { SearchInput } from './SearchInput';
import styles from './searchBar.module.css';

interface SearchBarProps {
	query?: string;
	isButton?: boolean;
}

export const SearchBar = ({ query, isButton }: SearchBarProps) => (
	<div className={styles.searchBar}>
		<BackButton
			ariaLabel={'Go back'}
			icon={<ArrowIcon className={styles.arrowIcon} />}
		/>
		{isButton ? (
			<Link href={'/search'} className={styles.inputWrapper}>
				<SearchInput
					icon={<SearchIcon className={styles.searchIcon} />}
					placeholder={'What do you want to watch?'}
					readOnly
				/>
			</Link>
		) : (
			<div className={styles.inputWrapper}>
				<SearchInput
					icon={<SearchIcon className={styles.searchIcon} />}
					query={query}
					placeholder={'What do you want to watch?'}
				/>
			</div>
		)}
	</div>
);
