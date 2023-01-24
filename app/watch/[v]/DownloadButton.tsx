'use client';

import FileDownloadIcon from '@/public/file-download-icon.svg';
import styles from './watch.module.scss';

export const DownloadButton = () => {
	const handleOnDownloadButtonClick = () => {};

	return (
		<button
			aria-label={'Open downloads menu'}
			onClick={handleOnDownloadButtonClick}
		>
			<FileDownloadIcon className={styles.secondaryButtonIcon} />
		</button>
	);
};
