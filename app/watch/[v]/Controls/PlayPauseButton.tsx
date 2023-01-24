'use client';

import {
	usePlayerStateDispatch,
	usePlayerState,
} from '../PlayerProvider/playerContext';
import { Children, JSXElementConstructor, ReactElement } from 'react';
import styles from './controls.module.scss';

interface PlayPauseButtonProps {
	children: ReactElement[];
}

export const PlayPauseButton = ({ children }: PlayPauseButtonProps) => {
	const { isPlaying } = usePlayerState();
	const playerStateDispatch = usePlayerStateDispatch();

	const Icon = Children.toArray(children).find(({ props: { id } }: any) =>
		isPlaying ? id === 'pause-icon' : id === 'play-icon'
	) as ReactElement<any, string | JSXElementConstructor<any>>;

	const ariaLabel = isPlaying ? 'Pause' : 'Play';

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
