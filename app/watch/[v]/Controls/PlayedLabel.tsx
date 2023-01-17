import { usePlayerState } from '../PlayerProvider/playerContext';
import { ScrubberLabel } from './ScrubberLabel';
import { formatDuration } from './util';

export const PlayedLabel = () => {
	const { played } = usePlayerState();

	return <ScrubberLabel text={formatDuration(played)} />;
};
