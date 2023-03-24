import Image from 'next/image';
import { Slider } from './Slider';
import { PlayedLabel } from './PlayedLabel';
import { TimeLeftLabel } from './TimeLeftLabel';
import { SkipButton } from './SkipButton';
import SkipForwardIcon from '@/public/skip-forward-icon.svg';
import SkipBackIcon from '@/public/skip-back-icon.svg';
import { PlayPauseButton } from './PlayPauseButton';
import playIconUrl from '@/public/play-icon.svg?url';
import pauseIconUrl from '@/public/pause-icon.svg?url';
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
				icon={<SkipBackIcon />}
			/>
			<div className={styles.playPause}>
				<PlayPauseButton
					playAriaLabel={'Play'}
					pauseAriaLabel={'Pause'}
					playIcon={<Image alt={''} src={playIconUrl} />}
					pauseIcon={<Image alt={''} src={pauseIconUrl} />}
				/>
				<BufferSpinner />
			</div>
			<SkipButton
				skipCount={SKIP_COUNT_SECONDS}
				ariaLabel={`Skip forward ${SKIP_COUNT_SECONDS} seconds`}
				icon={<SkipForwardIcon />}
			/>
		</div>
	</div>
);
