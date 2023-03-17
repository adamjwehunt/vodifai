import { BackButton } from './BackButton';
import ArrowIcon from '@/public/arrow-icon.svg';
import Link from 'next/link';
import SearchIcon from '@/public/search-icon.svg';
import { SearchInput } from './SearchInput';
import { SEARCH_BAR_PLACEHOLDER } from 'app/page';
import styles from './searchBar.module.css';

interface SearchBarProps {
	query?: string;
	button?: boolean;
}

export const SearchBar = ({ query, button }: SearchBarProps) => {
	return (
		<div className={styles.searchBar}>
			<BackButton
				ariaLabel={'Go back'}
				icon={<ArrowIcon className={styles.arrowIcon} />}
			/>
			{button ? (
				<Link href={'/search'} className={styles.inputWrapper}>
					<SearchInput
						icon={<SearchIcon className={styles.searchIcon} />}
						placeholder={SEARCH_BAR_PLACEHOLDER}
						readOnly
					/>
				</Link>
			) : (
				<div className={styles.inputWrapper}>
					<SearchInput
						icon={<SearchIcon className={styles.searchIcon} />}
						query={query}
						placeholder={SEARCH_BAR_PLACEHOLDER}
					/>
				</div>
			)}
		</div>
	);
};
