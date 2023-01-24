'use client';

import {
	usePlayerStateDispatch,
	usePlayerRef,
	usePlayerState,
} from '../PlayerProvider/playerContext';
import { Root, Track, Range, Thumb } from '@radix-ui/react-slider';
import styles from './controls.module.scss';

export const Slider = () => {
	const {
		duration,
		played,
		videoInfo: { videoDetails },
	} = usePlayerState();
	const playerStateDispatch = usePlayerStateDispatch();
	const { seekTo } = usePlayerRef();

	const handleSeek = ([seconds]: number[]) =>
		playerStateDispatch({ type: 'seekStart', seconds });

	const handleSeekCommitted = ([seconds]: number[]) => seekTo(seconds);

	return (
		<form>
			<Root
				className={styles.slider}
				value={[played]}
				max={duration || videoDetails.duration}
				step={1}
				aria-label="Player scrubber"
				onValueChange={handleSeek}
				onValueCommit={handleSeekCommitted}
			>
				<Track className={styles.track}>
					<Range className={styles.range} />
				</Track>
				<Thumb className={styles.thumb} />
			</Root>
		</form>
	);
};
