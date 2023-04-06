'use client';

import { usePlayerState } from '@/components/PlayerProvider/playerContext';
import { AnimatePresence, motion } from 'framer-motion';
import { DelayRender } from './DelayRender';
import styles from './controls.module.scss';

export const BufferSpinner = () => {
	const { isBuffering } = usePlayerState();

	return (
		<AnimatePresence>
			{!isBuffering ? null : (
				<DelayRender seconds={0.25}>
					<motion.div
						className={styles.bufferSpinner}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1, rotate: 360 }}
						exit={{ opacity: 0 }}
						transition={{
							rotate: {
								ease: 'linear',
								duration: 0.65,
								repeat: Infinity,
								delay: 0.2,
							},
							opacity: { duration: 0.35, delay: 0.3 },
						}}
					/>
				</DelayRender>
			)}
		</AnimatePresence>
	);
};
