'use client';

import styled from '@emotion/styled';
import { StyledComponent } from '../types';
import { useTranscriptState } from '../TranscriptProvider/transcriptContext';
import { AnimatePresence, motion } from 'framer-motion';
import { css } from '@emotion/react';
import { ReactElement } from 'react';

interface TopProps extends StyledComponent {
	children: ReactElement[];
}

export const Top = styled(({ className, children }: TopProps) => {
	const { isExpanded } = useTranscriptState();

	if (!isExpanded) {
		// Animates exit
		return <AnimatePresence />;
	}

	return (
		<AnimatePresence>
			{
				<motion.div
					className={className}
					initial={{ y: '-5rem', opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					exit={{ y: '-5rem', opacity: 0 }}
				>
					{children}
				</motion.div>
			}
		</AnimatePresence>
	);
})(css`
	position: absolute;
	left: 0;
	right: 0;
	z-index: 3;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1rem;
	background-color: rgb(185, 153, 190);
`);
