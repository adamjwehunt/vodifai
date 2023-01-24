'use client';

import { useRouter } from 'next/navigation';
import styles from './searchBar.module.css';

interface BackButtonProps {
	children: React.ReactNode;
}

export const BackButton = ({ children }: BackButtonProps) => {
	const router = useRouter();

	const handleBackButtonClick = () => router.back();

	return (
		<button onClick={handleBackButtonClick} className={styles.backButton}>
			{children}
		</button>
	);
};
