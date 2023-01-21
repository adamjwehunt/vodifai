'use client';

import { Bottom } from './Bottom';
import { MotionConfig } from 'framer-motion';
import { usePlayerState } from '../PlayerProvider/playerContext';
import { TranscriptProvider } from '../TranscriptProvider';
import { ReactElement } from 'react';

export const expandDuration = 0.3;

interface TranscriptProps {
	children: ReactElement[];
}

export const Transcript = ({ children }: TranscriptProps) => {
	const {
		videoInfo: { captions },
	} = usePlayerState();

	if (!captions.length) {
		return null;
	}

	return (
		<MotionConfig
			transition={{ type: 'ease-in-out', duration: expandDuration }}
		>
			<TranscriptProvider>
				{(captionsRef) => (
					<>
						{children}
						<Bottom captionsRef={captionsRef} />
					</>
				)}
			</TranscriptProvider>
		</MotionConfig>
	);
};
