'use client';

import { ReactElement } from 'react';
import {
	useTranscriptState,
	useTranscriptStateDispatch,
} from '../TranscriptProvider/transcriptContext';
import { motion } from 'framer-motion';
import styles from './transcript.module.scss';

const animateBottom = {
	top: '8dvh',
	bottom: 0,
	left: 0,
	right: 0,
	paddingTop: 0,
	paddingBottom: '21dvh',
};

interface BottomProps {
	children: ReactElement[];
}

export const Bottom = ({ children }: BottomProps) => {
	const { isExpanded } = useTranscriptState();
	const transcriptStateDispatch = useTranscriptStateDispatch();
	const handleOnAnimationStart = () =>
		transcriptStateDispatch({ type: 'animateStart' });
	const onAnimationComplete = () =>
		transcriptStateDispatch({ type: 'animateEnd' });

	return (
		<motion.div
			className={styles.bottom}
			onAnimationStart={handleOnAnimationStart}
			onAnimationComplete={onAnimationComplete}
			animate={isExpanded ? animateBottom : {}}
		>
			{children}
		</motion.div>
	);
};
