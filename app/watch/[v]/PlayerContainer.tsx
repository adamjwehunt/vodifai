'use client';

import { PlayerProvider } from './PlayerProvider';
import { Player } from './Player';
import { VideoInfo } from './types';

interface PlayerContainerProps {
	videoInfo: VideoInfo;
	children?: React.ReactNode;
}

export const PlayerContainer = ({
	videoInfo,
	children,
}: PlayerContainerProps) => (
	<PlayerProvider videoInfo={videoInfo}>
		{(playerRef) => (
			<>
				<Player playerRef={playerRef} />
				{children}
			</>
		)}
	</PlayerProvider>
);
