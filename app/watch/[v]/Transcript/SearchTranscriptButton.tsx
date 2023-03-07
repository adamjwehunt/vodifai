'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranscriptState } from '../TranscriptProvider/transcriptContext';
import {
	SearchTranscriptInput,
	SearchTranscriptInputRef,
} from './SearchTranscriptInput';
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
	const [isSearching, setIsSearching] = useState(false);
	const inputRef = useRef<SearchTranscriptInputRef>(null);
	const resetSearchTranscriptInput = () => inputRef.current?.reset();

	useEffect(() => {
		if (!isExpanded) {
			resetSearchTranscriptInput();
		}

		return resetSearchTranscriptInput();
	}, [isExpanded]);

	const toggleIsSearching = () => {
		if (isSearching) {
			resetSearchTranscriptInput();
		}

		setIsSearching(!isSearching);
	};

	const handleEscapeKeyDown = () => {
		setIsSearching(false);
	};

	return (
		<>
			<button
				className={styles.searchTranscriptButton}
				aria-label={ariaLabel}
				tabIndex={isExpanded ? 0 : -1}
				onClick={toggleIsSearching}
			>
				{icon}
			</button>
			{!isSearching ? null : (
				<SearchTranscriptInput
					onEscapeKeyDown={handleEscapeKeyDown}
					ref={inputRef}
				/>
			)}
		</>
	);
};
