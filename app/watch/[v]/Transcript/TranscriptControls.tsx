import { AnimatePresence, motion } from 'framer-motion';
import styled from '@emotion/styled';
import { Controls } from '../Controls';
import { css } from '@emotion/react';
import { StyledComponent } from '../types';

interface TranscriptControlsProps extends StyledComponent {
	isExpanded: boolean;
}

export const TranscriptControls = styled(
	({ isExpanded, className }: TranscriptControlsProps) => {
		if (!isExpanded) {
			// Animates exit
			return <AnimatePresence />;
		}

		return (
			<AnimatePresence>
				<motion.div
					className={className}
					initial={{ y: 0, opacity: 0 }}
					animate={{ y: '-18dvh', opacity: 1 }}
					exit={{ y: 0, opacity: 0 }}
				>
					<Controls />
				</motion.div>
			</AnimatePresence>
		);
	}
)(css`
	position: fixed;
	left: 0;
	right: 0;
	top: calc(100dvh - 2rem);
	z-index: 3;
	padding: 0px 1.5rem 4rem;
	background-color: rgb(185, 153, 190);
`);
