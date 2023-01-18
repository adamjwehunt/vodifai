'use client';

import { Player } from './Player';
import PlayerProvider from './PlayerProvider';
import { PlayerTools } from './PlayerTools';

interface PlayerContainerProps {
	youtubeUrl: string;
	videoDetails: any;
}

export default function PlayerContainer({
	youtubeUrl,
	videoDetails,
}: PlayerContainerProps) {
	return (
		<PlayerProvider>
			{(playerRef) => (
				<section>
					<Player playerRef={playerRef} url={youtubeUrl} />
					<PlayerTools playerInfo={videoDetails} />
				</section>
			)}
		</PlayerProvider>
	);
}
