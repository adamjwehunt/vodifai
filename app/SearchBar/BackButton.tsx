'use client';

import { useRouter } from 'next/navigation';
import styles from './searchBar.module.css';

interface BackButtonProps {
	children: React.ReactNode;
}

export const BackButton = ({ children }: BackButtonProps) => {
	const router = useRouter();

	return (
		<button onClick={() => router.back()} className={styles.backButton}>
			{children}
		</button>
	);
};
