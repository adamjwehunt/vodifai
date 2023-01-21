import {
	useCaptionsRef,
	useTranscriptState,
	useTranscriptStateDispatch,
} from '../TranscriptProvider/transcriptContext';
import ExpandIcon from '@/public/expand-icon.svg';
import styles from './transcript.module.scss';

export const ExpandButton = () => {
	const transcriptStateDispatch = useTranscriptStateDispatch();
	const { centerActiveCaption } = useCaptionsRef();
	const { isExpanded } = useTranscriptState();

	const handleExpandButtonClick = () => {
		transcriptStateDispatch({ type: 'toggleExpand' });
		centerActiveCaption();
	};

	return (
		<button
			className={styles.expandButton}
			aria-label={'Expand transcript'}
			tabIndex={isExpanded ? -1 : 0}
			onClick={handleExpandButtonClick}
		>
			<ExpandIcon className={styles.expandIcon} />
		</button>
	);
};
