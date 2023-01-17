import styled from '@emotion/styled';
import {
	usePlayerRef,
	usePlayerState,
	usePlayerStateDispatch,
} from '../PlayerProvider/playerContext';
import { clamp } from './util';
import { SkipIcon } from './SkipIcon';
import SkipForwardIcon from '../../../../public/skip-forward-icon.svg';
import SkipBackIcon from '../../../../public/skip-back-icon.svg';
import { css } from '@emotion/react';

const SKIP_COUNT_SECONDS = 15;

interface SkipButtonProps {
	back?: boolean;
}

export const SkipButton = styled(({ back }: SkipButtonProps) => {
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
		playerStateDispatch({ type: 'played', seconds });
	};

	return (
		<button
			aria-label={`Skip ${
				back ? 'back' : 'forward'
			} ${SKIP_COUNT_SECONDS} seconds`}
			color="primary"
			onClick={handleSkip}
		>
			<SkipIcon icon={back ? SkipBackIcon : SkipForwardIcon} />
		</button>
	);
})(css`
	&:hover svg {
		fill: white;
	}
`);
