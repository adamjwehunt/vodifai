'use client';

import { VideoInfo } from 'app/types';
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

export const expandDuration = 0.3;

interface PlayerProviderProps {
	children: ReactElement[];
	videoInfo: VideoInfo;
}

export const PlayerProvider = ({
	children,
	videoInfo,
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
						transition={{ type: 'ease-in-out', duration: expandDuration }}
					>
						{children}
					</MotionConfig>
				</PlayerRefContext.Provider>
			</PlayerStateDispatchContext.Provider>
		</PlayerStateContext.Provider>
	);
};
