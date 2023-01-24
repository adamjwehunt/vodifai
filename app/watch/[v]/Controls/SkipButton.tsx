'use client';

import { usePlayerRef, usePlayerState } from '../PlayerProvider/playerContext';
import { clamp } from './util';

const SKIP_COUNT_SECONDS = 15;

interface SkipButtonProps {
	back?: boolean;
	children?: React.ReactElement;
}

export const SkipButton = ({ back, children }: SkipButtonProps) => {
	const { duration, played } = usePlayerState();
	const { seekTo } = usePlayerRef();

	const ariaLabel = `Skip ${
		back ? 'back' : 'forward'
	} ${SKIP_COUNT_SECONDS} seconds`;

	const handleSkip = () => {
		const seconds = clamp(
			played + (back ? -SKIP_COUNT_SECONDS : SKIP_COUNT_SECONDS),
			0,
			duration
		);

		return seconds !== played ? seekTo(seconds) : null;
	};

	return (
		<button aria-label={ariaLabel} onClick={handleSkip}>
			{children}
		</button>
	);
};
