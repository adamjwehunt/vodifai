import { usePlayerState } from '../PlayerProvider/playerContext';
import { ScrubberLabel } from './ScrubberLabel';
import { formatDuration } from './util';

export const TimeLeftLabel = () => {
	const {
		duration,
		played,
		videoInfo: { videoDetails },
	} = usePlayerState();
	const total = duration || videoDetails.duration;

	return (
		<ScrubberLabel
			text={`${total === played ? '' : '-'}${formatDuration(
				total - played
			)}`}
		/>
	);
};
