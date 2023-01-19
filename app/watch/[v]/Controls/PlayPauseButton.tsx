import {
	usePlayerStateDispatch,
	usePlayerState,
} from '../PlayerProvider/playerContext';
import { PlayPauseIcon } from './PlayPauseIcon';
import PlayIcon from '@/public/play-icon.svg';
import PauseIcon from '@/public/pause-icon.svg';

export const PlayPauseButton = () => {
	const { isPlaying } = usePlayerState();
	const playerStateDispatch = usePlayerStateDispatch();

	return (
		<button
			aria-label={isPlaying ? 'Pause' : 'Play'}
			color="primary"
			onClick={() =>
				playerStateDispatch({ type: isPlaying ? 'pause' : 'play' })
			}
		>
			<PlayPauseIcon icon={isPlaying ? PauseIcon : PlayIcon} />
		</button>
	);
};
