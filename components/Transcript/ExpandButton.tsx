'use client';

import { ReactElement } from 'react';
import {
	useCaptionsRef,
	useTranscriptState,
	useTranscriptStateDispatch,
} from '../TranscriptProvider/transcriptContext';
import styles from './transcript.module.scss';

interface ExpandButtonProps {
	ariaLabel: string;
	children: ReactElement;
}

export const ExpandButton = ({ ariaLabel, children }: ExpandButtonProps) => {
	const transcriptStateDispatch = useTranscriptStateDispatch();
	const { centerActiveCaption } = useCaptionsRef();
	const { isExpanded } = useTranscriptState();

	const handleExpandButtonClick = () => {
		transcriptStateDispatch({ type: 'toggleExpand' });

		// Prioritize toggleExpand action over centering the active caption
		setTimeout(() => {
			centerActiveCaption();
		}, 0);
	};

	return (
		<button
			className={styles.expandButton}
			aria-label={ariaLabel}
			tabIndex={isExpanded ? -1 : 0}
			onClick={handleExpandButtonClick}
		>
			{children}
		</button>
	);
};
