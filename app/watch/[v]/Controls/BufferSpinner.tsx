'use client';

import styled from '@emotion/styled';
import { StyledComponent } from '../types';
import { usePlayerState } from '../PlayerProvider/playerContext';
import { AnimatePresence, motion } from 'framer-motion';
import { DelayRender } from './DelayRender';
import { css } from '@emotion/react';

export const BufferSpinner = styled(({ className }: StyledComponent) => {
	const { isBuffering } = usePlayerState();

	if (!isBuffering) {
		// Animates exit
		return <AnimatePresence />;
	}

	return (
		<AnimatePresence>
			<DelayRender seconds={0.25}>
				<motion.div
					className={className}
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
		</AnimatePresence>
	);
})(() => {
	const insetPosition = css`
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
	`;

	const pseudoElementBase = css`
		content: '';
		${insetPosition};
		border-radius: 50%;
	`;

	return css`
		${insetPosition}
		pointer-events: none;

		&:before {
			${pseudoElementBase};
			opacity: 0.3;
			background: #fff;
		}

		&:after {
			${pseudoElementBase};
			border: 0.375rem solid transparent;
			border-top-color: #fff;
		}
	`;
});
