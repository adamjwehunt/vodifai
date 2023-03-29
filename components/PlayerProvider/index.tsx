'use client';

import { VideoInfo } from 'app/types';
import { Fade } from 'components/Fade';
import { MotionConfig } from 'framer-motion';
import { ReactElement, useReducer, useRef } from 'react';
import ReactPlayer from 'react-player';
import {
	PlayerStateContext,
	PlayerStateDispatchContext,
	PlayerRefContext,
} from './playerContext';
import { playerReducer, DEFAULT_PLAYER_REDUCER_STATE } from './playerReducer';
import { PlayerReducerState, PlayerReducerAction } from './types';
import styles from './playerProvider.module.css';

export const EXPAND_DURATION = 0.28;

interface PlayerProviderProps {
	children: ReactElement[];
	videoInfo: VideoInfo;
	backgroundColor: string;
}

export const PlayerProvider = ({
	children,
	videoInfo,
	backgroundColor,
}: PlayerProviderProps) => {
	const [playerState, playerStateDispatch] = useReducer(
		(previousState: PlayerReducerState, action: PlayerReducerAction) =>
			playerReducer(previousState, action),
		{ ...DEFAULT_PLAYER_REDUCER_STATE, videoInfo }
	);

	const playerRef = useRef<ReactPlayer | null>(null);

	return (
		<PlayerStateContext.Provider value={playerState}>
			<PlayerStateDispatchContext.Provider value={playerStateDispatch}>
				<PlayerRefContext.Provider value={playerRef}>
					<MotionConfig
						transition={{ type: 'ease-in-out', duration: EXPAND_DURATION }}
					>
						<Fade className={styles.watchView} style={{ backgroundColor }} />
						<Fade className={styles.watchView} foreground>
							{children}
						</Fade>
					</MotionConfig>
				</PlayerRefContext.Provider>
			</PlayerStateDispatchContext.Provider>
		</PlayerStateContext.Provider>
	);
};
