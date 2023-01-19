'use client';

import { ForwardedRef, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import ReactPlayer, { Config } from 'react-player';
import { OnProgressProps } from 'react-player/base';
import { StyledComponent } from './types';
import {
	usePlayerStateDispatch,
	usePlayerState,
} from './PlayerProvider/playerContext';
import { css } from '@emotion/react';

const reactPlayerConfig: Config = {
	youtube: {
		playerVars: {
			wmode: 'opaque',
		},
	},
};

interface PlayerProps extends StyledComponent {
	playerRef: ForwardedRef<ReactPlayer>;
}

export const Player = styled(({ className, playerRef }: PlayerProps) => {
	// Render react-player on the client only
	const [isSSR, setIsSSR] = useState(true);
	useEffect(() => {
		setIsSSR(false);
	}, []);

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
		<div className={className}>
			{isSSR ? null : (
				<ReactPlayer
					ref={playerRef}
					playing={isPlaying}
					url={url}
					muted={true}
					controls={true}
					config={reactPlayerConfig}
					style={{ position: 'sticky', top: '6dvh' }}
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
			)}
		</div>
	);
})(css`
	position: absolute;
	inset: 0;
	bottom: 35dvh;
	display: flex;
	align-items: center;
`);
