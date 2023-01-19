'use client';

import { Player } from './Player';
import PlayerProvider from './PlayerProvider';
import { PlayerTools } from './PlayerTools';
import { VideoInfo } from './types';

interface PlayerContainerProps {
	videoInfo: VideoInfo;
}

export default function PlayerContainer({ videoInfo }: PlayerContainerProps) {
	return (
		<PlayerProvider>
			{(playerRef) => (
				<section>
					<Player playerRef={playerRef} url={videoInfo.url} />
					<PlayerTools videoInfo={videoInfo} />
				</section>
			)}
		</PlayerProvider>
	);
}
