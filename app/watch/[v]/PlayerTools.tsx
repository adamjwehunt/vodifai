import Transcript from './Transcript';
import { PlayerTray } from './PlayerTray';
import { VideoInfo } from './types';

interface PlayerToolsProps {
	videoInfo: VideoInfo;
}

export const PlayerTools = ({ videoInfo }: PlayerToolsProps) => {
	return (
		<>
			<PlayerTray videoDetails={videoInfo?.videoDetails} />
			<Transcript videoInfo={videoInfo} />
		</>
	);
};
