'use client';

import { MutableRefObject, ReactNode, useReducer, useRef } from 'react';
import ReactPlayer from 'react-player';
import { VideoInfo } from '../types';
import {
	PlayerStateContext,
	PlayerStateDispatchContext,
	PlayerRefContext,
} from './playerContext';
import { playerReducer, DEFAULT_PLAYER_REDUCER_STATE } from './playerReducer';
import { PlayerReducerState, PlayerReducerAction } from './types';

interface PlayerProviderProps {
	children: (playerRef: MutableRefObject<ReactPlayer | null>) => ReactNode;
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
					{children(playerRef)}
				</PlayerRefContext.Provider>
			</PlayerStateDispatchContext.Provider>
		</PlayerStateContext.Provider>
	);
};
