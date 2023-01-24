'use client';

import { ReactElement } from 'react';
import { useTranscriptState } from '../TranscriptProvider/transcriptContext';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './transcript.module.scss';

interface TranscriptControlsProps {
	children: ReactElement;
}

export const TranscriptControls = ({ children }: TranscriptControlsProps) => {
	const { isExpanded } = useTranscriptState();

	return (
		<AnimatePresence>
			{!isExpanded ? null : (
				<motion.div
					className={styles.transcriptControls}
					initial={{ y: 0, opacity: 0 }}
					animate={{ y: '-18dvh', opacity: 1 }}
					exit={{ y: 0, opacity: 0 }}
				>
					{children}
				</motion.div>
			)}
		</AnimatePresence>
	);
};
