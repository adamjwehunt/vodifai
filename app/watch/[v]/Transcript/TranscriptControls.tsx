'use client';

import { useTranscriptState } from '../TranscriptProvider/transcriptContext';
import { AnimatePresence, motion } from 'framer-motion';
import { ReactElement } from 'react';
import styles from './transcript.module.scss';

interface TranscriptControlsProps {
	children: ReactElement;
}

export const TranscriptControls = ({ children }: TranscriptControlsProps) => {
	const { isExpanded } = useTranscriptState();

	if (!isExpanded) {
		// Animates exit
		return <AnimatePresence />;
	}

	return (
		<AnimatePresence>
			<motion.div
				className={styles.transcriptControls}
				initial={{ y: 0, opacity: 0 }}
				animate={{ y: '-18dvh', opacity: 1 }}
				exit={{ y: 0, opacity: 0 }}
			>
				{children}
			</motion.div>
		</AnimatePresence>
	);
};
