'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ReactElement } from 'react';
import styles from 'app/page.module.scss';

interface VideoResultsProps {
	isVisible: boolean;
	backgroundImage: string;
	children: ReactElement | ReactElement[];
}

export const VideoResults = ({
	backgroundImage,
	isVisible,
	children,
}: VideoResultsProps) => {
	return (
		<AnimatePresence>
			{!isVisible ? null : (
				<motion.div
					className={styles.searchResults}
					style={{
						backgroundImage,
					}}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				>
					{children}
				</motion.div>
			)}
		</AnimatePresence>
	);
};
