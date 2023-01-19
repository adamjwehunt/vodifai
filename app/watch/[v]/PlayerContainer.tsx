'use client';

import { PlayerProvider } from './PlayerProvider';
import { PlayerTray } from './PlayerTray';
import { Player } from './Player';
import { Transcript } from './Transcript';
import { VideoInfo } from './types';

interface PlayerContainerProps {
	videoInfo: VideoInfo;
}

export const PlayerContainer = ({ videoInfo }: PlayerContainerProps) => (
	<PlayerProvider videoInfo={videoInfo}>
		{(playerRef) => (
			<section>
				<Player playerRef={playerRef} />
				<PlayerTray />
				<Transcript />
			</section>
		)}
	</PlayerProvider>
);
