'use client';

import {
	useCaptionsRef,
	useTranscriptState,
	useTranscriptStateDispatch,
} from '../TranscriptProvider/transcriptContext';
import ChevronDownIcon from '@/public/chevron-back-icon.svg';
import styles from './transcript.module.scss';

export const MinimizeButton = () => {
	const transcriptStateDispatch = useTranscriptStateDispatch();
	const { centerActiveCaption } = useCaptionsRef();
	const { isExpanded } = useTranscriptState();

	const handleMinimizeButtonClick = () => {
		transcriptStateDispatch({ type: 'toggleExpand' });
		centerActiveCaption();
	};

	return (
		<button
			className={styles.minimizeButton}
			aria-label={'Minimize transcript'}
			tabIndex={isExpanded ? 0 : -1}
			onClick={handleMinimizeButtonClick}
		>
			<ChevronDownIcon className={styles.chevronDownIcon} />
		</button>
	);
};
