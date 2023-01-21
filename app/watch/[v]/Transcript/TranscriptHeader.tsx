import { ExpandButton } from './ExpandButton';
import styles from './transcript.module.scss';

export const TranscriptHeader = () => (
	<div className={styles.transcriptHeader}>
		<div>{'Transcript'}</div>
		<ExpandButton />
	</div>
);
