'use client';

import FileDownloadIcon from '@/public/file-download-icon.svg';
import styles from './watch.module.scss';

export const DownloadButton = () => {
	const handleDownloadButtonClick = () => {};

	return (
		<button
			aria-label={'Open downloads menu'}
			onClick={handleDownloadButtonClick}
		>
			<FileDownloadIcon className={styles.secondaryButtonIcon} />
		</button>
	);
};
