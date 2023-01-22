'use client';

import { Bottom } from './Bottom';
import { MotionConfig } from 'framer-motion';
import { TranscriptProvider } from '../TranscriptProvider';
import { ReactElement } from 'react';
import { Caption } from '../types';

export const expandDuration = 0.3;

interface TranscriptProps {
	children: ReactElement[];
	captions: Caption[];
}

export const TranscriptWrapper = ({ children, captions }: TranscriptProps) => (
	<MotionConfig transition={{ type: 'ease-in-out', duration: expandDuration }}>
		<TranscriptProvider captions={captions}>
			{(captionsRef) => (
				<>
					{children}
					<Bottom captionsRef={captionsRef} />
				</>
			)}
		</TranscriptProvider>
	</MotionConfig>
);
