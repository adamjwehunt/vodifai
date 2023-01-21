import { RefObject } from 'react';
import {
	useTranscriptState,
	useTranscriptStateDispatch,
} from '../TranscriptProvider/transcriptContext';
import { motion } from 'framer-motion';
import { TranscriptHeader } from './TranscriptHeader';
import { Captions, CaptionsHandle } from './Captions';
import styles from './transcript.module.scss';

interface BottomProps {
	captionsRef: RefObject<CaptionsHandle>;
}

export const Bottom = ({ captionsRef }: BottomProps) => {
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
			<TranscriptHeader />
			<Captions ref={captionsRef} />
		</motion.div>
	);
};
