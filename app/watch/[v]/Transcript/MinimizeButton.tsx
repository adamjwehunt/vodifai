'use client';

import {
	useCaptionsRef,
	useTranscriptState,
	useTranscriptStateDispatch,
} from '../TranscriptProvider/transcriptContext';
import styles from './transcript.module.scss';

interface MinimizeButtonProps {
	ariaLabel: string;
	icon: React.ReactNode;
}

export const MinimizeButton = ({ ariaLabel, icon }: MinimizeButtonProps) => {
	const transcriptStateDispatch = useTranscriptStateDispatch();
	const { centerActiveCaption } = useCaptionsRef();

	const { isExpanded } = useTranscriptState();

	const handleMinimizeButtonClick = () => {
		transcriptStateDispatch({ type: 'toggleExpand' });

		// Delay centering the active caption to increase performance
		setTimeout(() => {
			centerActiveCaption();
		}, 0);
	};

	return (
		<button
			className={styles.minimizeButton}
			aria-label={ariaLabel}
			tabIndex={isExpanded ? 0 : -1}
			onClick={handleMinimizeButtonClick}
		>
			{icon}
		</button>
	);
};
