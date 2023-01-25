'use client';

import styles from './watch.module.scss';

interface ShareButtonProps {
	ariaLabel: string;
	icon: React.ReactNode;
}

export const ShareButton = ({ ariaLabel, icon }: ShareButtonProps) => {
	const handleOnShareButtonClick = () => {};

	return (
		<button
			className={styles.shareButton}
			aria-label={ariaLabel}
			onClick={handleOnShareButtonClick}
		>
			{icon}
		</button>
	);
};
