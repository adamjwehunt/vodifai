'use client';

import ShareIcon from '@/public/share-icon.svg';
import styles from './watch.module.scss';

export const ShareButton = () => {
	const handleOnShareButtonClick = () => {};

	return (
		<button
			className={styles.shareButton}
			aria-label={'Share Video'}
			onClick={handleOnShareButtonClick}
		>
			<ShareIcon className={styles.secondaryButtonIcon} />
		</button>
	);
};
