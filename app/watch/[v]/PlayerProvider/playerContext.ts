import { createContext, Dispatch, RefObject, useContext } from 'react';
import ReactPlayer from 'react-player';
import { PlayerReducerAction, PlayerReducerState } from './types';

export const PlayerStateContext = createContext<PlayerReducerState | null>(
	null
);

export const PlayerStateDispatchContext =
	createContext<Dispatch<PlayerReducerAction> | null>(null);

export const PlayerRefContext = createContext<RefObject<ReactPlayer> | null>(
	null
);

export const usePlayerState = () => {
	const playerState = useContext(PlayerStateContext);

	if (playerState === null) {
		throw Error('PlayerStateContext has not been provided.');
	}

	return playerState;
};

export const usePlayerStateDispatch = () => {
	const playerStateDispatch = useContext(PlayerStateDispatchContext);

	if (playerStateDispatch === null) {
		throw Error('PlayerStateDispatchContext has not been provided.');
	}

	return playerStateDispatch;
};

export const usePlayerRef = () => {
	const playerRef = useContext(PlayerRefContext);
	const playerStateDispatch = usePlayerStateDispatch();


	if (playerRef === null) {
		throw Error('PlayerRefContext has not been provided.');
	}

	const handleSeekTo = (seconds: number) => {
		playerStateDispatch({ type: 'seekEnd', seconds });
		playerRef.current?.seekTo(seconds);
	};

	return { seekTo: handleSeekTo };
};
