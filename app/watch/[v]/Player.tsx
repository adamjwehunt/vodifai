'use client';

import { useContext } from 'react';
import dynamic from 'next/dynamic';
const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false });
import { Config } from 'react-player';
import { OnProgressProps } from 'react-player/base';
import {
	usePlayerStateDispatch,
	usePlayerState,
	PlayerRefContext,
} from './PlayerProvider/playerContext';
import styles from './watch.module.scss';

const reactPlayerConfig: Config = {
	youtube: {
		playerVars: {
			wmode: 'opaque',
		},
	},
};

export const Player = () => {
	const playerRef = useContext(PlayerRefContext);
	const {
		isPlaying,
		isSeeking,
		hasSeeked,
		videoInfo: { url },
	} = usePlayerState();

	const playerStateDispatch = usePlayerStateDispatch();

	const dispatchPlayed = (seconds: number) => {
		if (isSeeking) {
			return;
		}

		// Ignores ReactPlayer from sometimes returning a previous progress value after seek
		if (hasSeeked) {
			playerStateDispatch({ type: 'seekComplete' });
			return;
		}

		playerStateDispatch({
			type: 'played',
			seconds,
		});
	};
	const handleDuration = (seconds: number) =>
		playerStateDispatch({
			type: 'duration',
			seconds,
		});
	const handleSeek = (seconds: number) => dispatchPlayed(seconds);
	const handleProgress = ({ playedSeconds }: OnProgressProps) =>
		dispatchPlayed(playedSeconds);
	const handlePlay = () => playerStateDispatch({ type: 'play' });
	const handlePause = () => playerStateDispatch({ type: 'pause' });
	const handleBuffer = () => playerStateDispatch({ type: 'buffer' });
	const handleBufferEnd = () => playerStateDispatch({ type: 'bufferEnd' });

	return (
		<div className={styles.player}>
			<ReactPlayer
				ref={playerRef}
				playing={isPlaying}
				url={url}
				// temporary for development
				muted
				controls
				config={reactPlayerConfig}
				style={{ position: 'sticky', top: '8dvh' }}
				width={'100%'}
				height={'56.25dvw'}
				onSeek={handleSeek}
				onPlay={handlePlay}
				onPause={handlePause}
				onBuffer={handleBuffer}
				onBufferEnd={handleBufferEnd}
				onProgress={handleProgress}
				onDuration={handleDuration}
			/>
		</div>
	);
};
