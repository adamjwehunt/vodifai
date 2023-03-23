import { BackButton } from './BackButton';
import Link from 'next/link';
import VodifaiLogo from '@/public/vodifai-logo.svg';
import ArrowIcon from '@/public/arrow-icon.svg';
import SearchIcon from '@/public/search-icon.svg';
import { SearchInput } from './SearchInput';
import { SEARCH_BAR_PLACEHOLDER } from 'app/page';
import { AboutButton } from '../AboutButton';
import styles from './searchBar.module.scss';

interface SearchBarProps {
	query?: string;
	button?: boolean;
}

export const SearchBar = ({ query, button }: SearchBarProps) => {
	return (
		<div className={styles.searchBar}>
			<Link className={styles.home} href={'/'}>
				<VodifaiLogo className={styles.logo} />
			</Link>
			<div className={styles.inputContainer}>
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
			<div className={styles.about}>
				<AboutButton />
			</div>
		</div>
	);
};
