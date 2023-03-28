'use client';

import {
	usePlayerStateDispatch,
	usePlayerState,
} from '../PlayerProvider/playerContext';
import { ReactElement } from 'react';
import styles from './controls.module.scss';

interface PlayPauseButtonProps {
	playAriaLabel: string;
	pauseAriaLabel: string;
	playIcon: ReactElement;
	pauseIcon: ReactElement;
}

export const PlayPauseButton = ({
	playAriaLabel,
	pauseAriaLabel,
	playIcon,
	pauseIcon,
}: PlayPauseButtonProps) => {
	const { isPlaying } = usePlayerState();
	const playerStateDispatch = usePlayerStateDispatch();

	const Icon = isPlaying ? pauseIcon : playIcon;
	const ariaLabel = isPlaying ? pauseAriaLabel : playAriaLabel;

	const handOnClick = () =>
		playerStateDispatch({ type: isPlaying ? 'pause' : 'play' });

	return (
		<button
			className={styles.playPauseButton}
			aria-label={ariaLabel}
			onClick={handOnClick}
		>
			{Icon}
		</button>
	);
};
