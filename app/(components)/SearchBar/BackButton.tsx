'use client';

import { useRouter } from 'next/navigation';
import styles from './searchBar.module.css';

interface BackButtonProps {
	ariaLabel: string;
	icon: React.ReactNode;
}

export const BackButton = ({ ariaLabel, icon }: BackButtonProps) => {
	const router = useRouter();

	const handleBackButtonClick = () => router.back();

	return (
		<button
			className={styles.backButton}
			aria-label={ariaLabel}
			onClick={handleBackButtonClick}
		>
			{icon}
		</button>
	);
};
