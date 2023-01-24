'use client';

import { ReactElement } from 'react';
import {
	useTranscriptState,
	useTranscriptStateDispatch,
} from '../TranscriptProvider/transcriptContext';
import { motion } from 'framer-motion';
import {Captions} from './Captions';
import styles from './transcript.module.scss';

interface BottomProps {
	children: ReactElement;
}

export const Bottom = ({ children }: BottomProps) => {
	const { isExpanded } = useTranscriptState();
	const transcriptStateDispatch = useTranscriptStateDispatch();

	return (
		<motion.div
			className={styles.bottom}
			onAnimationStart={() => transcriptStateDispatch({ type: 'animateStart' })}
			onAnimationComplete={() =>
				transcriptStateDispatch({ type: 'animateEnd' })
			}
			animate={{
				...(isExpanded && {
					top: '8dvh',
					bottom: 0,
					left: 0,
					right: 0,
					paddingTop: 0,
					paddingBottom: '21dvh',
				}),
			}}
		>
			{children}
			<Captions />
		</motion.div>
	);
};
