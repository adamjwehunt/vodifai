'use client';

import { useTranscriptState } from '../TranscriptProvider/transcriptContext';
import { AnimatePresence, motion } from 'framer-motion';
import { ReactElement } from 'react';
import styles from './transcript.module.scss';

interface TopProps {
	children: ReactElement[];
}

export const Top = ({ children }: TopProps) => {
	const { isExpanded } = useTranscriptState();

	if (!isExpanded) {
		// Animates exit
		return <AnimatePresence />;
	}

	return (
		<AnimatePresence>
			{
				<motion.div
					className={styles.top}
					initial={{ y: '-5rem', opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					exit={{ y: '-5rem', opacity: 0 }}
				>
					{children}
				</motion.div>
			}
		</AnimatePresence>
	);
};
