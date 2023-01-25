'use client';

import { useTranscriptState } from '../TranscriptProvider/transcriptContext';
import styles from './transcript.module.scss';

interface SearchTranscriptButtonProps {
	ariaLabel: string;
	icon: React.ReactNode;
}

export const SearchTranscriptButton = ({
	ariaLabel,
	icon,
}: SearchTranscriptButtonProps) => {
	const { isExpanded } = useTranscriptState();

	const handleOnSearchTranscriptButtonClick = () => {};

	return (
		<button
			className={styles.searchTranscriptButton}
			aria-label={ariaLabel}
			tabIndex={isExpanded ? 0 : -1}
			onClick={handleOnSearchTranscriptButtonClick}
		>
			{icon}
		</button>
	);
};
