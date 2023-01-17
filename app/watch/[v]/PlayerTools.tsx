import Transcript from './Transcript';
import usePlayerInfo from './hooks/usePlayerInfo';
import { PlayerTray } from './PlayerTray';

export const PlayerTools = ({ url }: { url: string }) => {
	const playerInfo = usePlayerInfo(url);

	return (
		<>
			<PlayerTray videoDetails={playerInfo?.videoDetails} />
			<Transcript playerInfo={playerInfo} />
		</>
	);
};
