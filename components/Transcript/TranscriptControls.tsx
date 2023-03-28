'use client';

import { ReactElement } from 'react';
import { useTranscriptState } from '../TranscriptProvider/transcriptContext';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './transcript.module.scss';

export const TRANSCRIPT_CONTROLS_HEIGHT = '9rem';

interface TranscriptControlsProps {
	children: ReactElement[];
}

export const TranscriptControls = ({ children }: TranscriptControlsProps) => {
	const { isExpanded } = useTranscriptState();

	return (
		<AnimatePresence>
			{!isExpanded ? null : (
				<motion.div
					className={styles.transcriptControls}
					initial={{ y: 0, opacity: 0 }}
					animate={{ y: `-${TRANSCRIPT_CONTROLS_HEIGHT}`, opacity: 1 }}
					exit={{ y: 0, opacity: 0 }}
				>
					{children}
				</motion.div>
			)}
		</AnimatePresence>
	);
};
