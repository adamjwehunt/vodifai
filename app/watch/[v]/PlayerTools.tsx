import Transcript from './Transcript';
import { PlayerTray } from './PlayerTray';

export const PlayerTools = ({ playerInfo }) => {
	return (
		<>
			<PlayerTray videoDetails={playerInfo?.videoDetails} />
			<Transcript playerInfo={playerInfo} />
		</>
	);
};
