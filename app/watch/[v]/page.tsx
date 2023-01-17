'use client';

import { Player } from './Player';
import PlayerProvider from './PlayerProvider';
import { PlayerTools } from './PlayerTools';

const baseYoutubeUrl = 'https://www.youtube.com/watch?v=';

interface WatchPageProps {
	params: { v: string };
}

export default function WatchPage({ params: { v } }: WatchPageProps) {
	const youtubeUrl = `${baseYoutubeUrl}${v}`;

	return (
		<PlayerProvider>
			{(playerRef) => (
				<>
					<Player playerRef={playerRef} url={youtubeUrl} />
					<PlayerTools url={youtubeUrl} />
				</>
			)}
		</PlayerProvider>
	);
}
