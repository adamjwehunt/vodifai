'use client';

import SearchIcon from '@/public/search-icon.svg';
import styles from './transcript.module.scss';

export const SearchTranscriptButton = () => {
	const handleOnSearchTranscriptButtonClick = () => {};

	return (
		<button
			className={styles.searchTranscriptButton}
			aria-label={'Menu'}
			onClick={handleOnSearchTranscriptButtonClick}
		>
			<SearchIcon className={styles.searchIcon} />
		</button>
	);
};
