import { usePlayerState } from '../PlayerProvider/playerContext';
import { ScrubberLabel } from './ScrubberLabel';
import { formatDuration } from './util';

export const TimeLeftLabel = () => {
	const { duration, played } = usePlayerState();

	return (
		<ScrubberLabel
			text={`${duration === played ? '' : '-'}${formatDuration(
				duration - played
			)}`}
		/>
	);
};
