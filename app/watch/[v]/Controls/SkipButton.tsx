'use client';

import {
	usePlayerRef,
	usePlayerState,
	usePlayerStateDispatch,
} from '../PlayerProvider/playerContext';
import { clamp } from './util';

const SKIP_COUNT_SECONDS = 15;

interface SkipButtonProps {
	back?: boolean;
	children?: React.ReactElement;
}

export const SkipButton = ({ back, children }: SkipButtonProps) => {
	const { duration, played } = usePlayerState();
	const playerStateDispatch = usePlayerStateDispatch();
	const { seekTo } = usePlayerRef();

	const handleSkip = () => {
		const seconds = clamp(
			played + (back ? -SKIP_COUNT_SECONDS : SKIP_COUNT_SECONDS),
			0,
			duration
		);

		if (seconds === played) {
			return;
		}

		seekTo(seconds);
		playerStateDispatch({ type: 'seekEnd', seconds });
	};

	return (
		<button
			aria-label={`Skip ${
				back ? 'back' : 'forward'
			} ${SKIP_COUNT_SECONDS} seconds`}
			onClick={handleSkip}
		>
			{children}
		</button>
	);
};
