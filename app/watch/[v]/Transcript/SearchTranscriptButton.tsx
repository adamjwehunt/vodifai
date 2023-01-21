'use client';

import SearchIcon from '@/public/search-icon.svg';
import styles from './transcript.module.scss';

export const SearchTranscriptButton = () => (
	<button
		className={styles.searchTranscriptButton}
		aria-label={'Menu'}
		onClick={() => {}}
	>
		<SearchIcon className={styles.searchIcon} />
	</button>
);
