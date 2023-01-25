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

const SKIP_COUNT_SECONDS = 15;

export const Controls = () => (
	<div className={styles.controls}>
		<div className={styles.scrubberWrapper}>
			<div className={styles.scrubber}>
				<Slider ariaLabel={'Player scrubber'} />
				<div className={styles.scrubberLabels}>
					<PlayedLabel label={<div className={styles.scrubberLabel} />} />
					<TimeLeftLabel label={<div className={styles.scrubberLabel} />} />
				</div>
			</div>
		</div>
		<div className={styles.controlsButtons}>
			<SkipButton
				back
				skipCount={SKIP_COUNT_SECONDS}
				ariaLabel={`Skip back ${SKIP_COUNT_SECONDS} seconds`}
				icon={<SkipBackIcon className={styles.skipIcon} />}
			/>
			<div className={styles.playPause}>
				<PlayPauseButton
					playAriaLabel={'Play'}
					pauseAriaLabel={'Pause'}
					playIcon={<PlayIcon />}
					pauseIcon={<PauseIcon />}
				/>
				<BufferSpinner />
			</div>
			<SkipButton
				skipCount={SKIP_COUNT_SECONDS}
				ariaLabel={`Skip forward ${SKIP_COUNT_SECONDS} seconds`}
				icon={<SkipForwardIcon className={styles.skipIcon} />}
			/>
		</div>
	</div>
);
