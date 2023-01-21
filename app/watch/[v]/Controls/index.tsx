import { Slider } from './Slider';
import { PlayedLabel } from './PlayedLabel';
import { TimeLeftLabel } from './TimeLeftLabel';
import { SkipButton } from './SkipButton';
import SkipForwardIcon from '@/public/skip-forward-icon.svg';
import SkipBackIcon from '@/public/skip-back-icon.svg';
import { PlayPauseButton } from './PlayPauseButton';
import PlayIcon from '@/public/play-icon.svg';
import PauseIcon from '@/public/pause-icon.svg';
import { BufferSpinner } from './BufferSpinner';
import styles from './controls.module.scss';

export const Controls = () => (
	<div className={styles.controls}>
		<div className={styles.scrubberWrapper}>
			<div className={styles.scrubber}>
				<Slider />
				<div className={styles.scrubberLabels}>
					<PlayedLabel>
						<div className={styles.scrubberLabel} />
					</PlayedLabel>
					<TimeLeftLabel>
						<div className={styles.scrubberLabel} />
					</TimeLeftLabel>
				</div>
			</div>
		</div>
		<div className={styles.controlsButtons}>
			<SkipButton back>
				<SkipBackIcon className={styles.skipIcon} />
			</SkipButton>
			<div className={styles.playPause}>
				<PlayPauseButton>
					<PlayIcon id={'play-icon'} />
					<PauseIcon id={'pause-icon'} />
				</PlayPauseButton>
				<BufferSpinner />
			</div>
			<SkipButton>
				<SkipForwardIcon className={styles.skipIcon} />
			</SkipButton>
		</div>
	</div>
);
