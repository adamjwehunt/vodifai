'use client';

import { usePlayerRef, usePlayerState } from '../PlayerProvider/playerContext';
import { clamp } from './util';

interface SkipButtonProps {
	back?: boolean;
	skipCount: number;
	ariaLabel: string;
	icon: React.ReactElement;
}

export const SkipButton = ({
	back,
	skipCount,
	ariaLabel,
	icon,
}: SkipButtonProps) => {
	const { duration, played } = usePlayerState();
	const { seekTo } = usePlayerRef();

	const handleSkip = () => {
		const seconds = clamp(
			played + (back ? -skipCount : skipCount),
			0,
			duration
		);

		return seconds !== played ? seekTo(seconds) : null;
	};

	return (
		<button aria-label={ariaLabel} onClick={handleSkip}>
			{icon}
		</button>
	);
};
