'use client';

import { ReactElement, useRef } from 'react';
import {
	useTranscriptState,
	useTranscriptStateDispatch,
} from '../TranscriptProvider/transcriptContext';
import { motion } from 'framer-motion';
import styles from './transcript.module.scss';

const expanded = {
	top: '5rem',
	bottom: 0,
	left: 0,
	right: 0,
	paddingTop: 0,
	paddingBottom: '9rem',
};

interface BottomProps {
	children: ReactElement[];
}

export const Bottom = ({ children }: BottomProps) => {
	const { isExpanded } = useTranscriptState();
	const bottomRef = useRef<HTMLDivElement>(null);
	const transcriptStateDispatch = useTranscriptStateDispatch();
	const handleOnAnimationStart = () =>
		transcriptStateDispatch({ type: 'animateStart' });
	const onAnimationComplete = () => {
		transcriptStateDispatch({ type: 'animateEnd' });
		if (!isExpanded) {
			setTimeout(() => {
				bottomRef.current?.style.removeProperty('inset');
			}, 0);
		}
	};

	return (
		<motion.div
			layoutScroll
			ref={bottomRef}
			className={styles.bottom}
			onAnimationStart={handleOnAnimationStart}
			onAnimationComplete={onAnimationComplete}
			animate={!isExpanded ? {} : expanded}
		>
			{children}
		</motion.div>
	);
};
