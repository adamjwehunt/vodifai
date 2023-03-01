'use client';

import { useCallback, useRef, useState } from 'react';
import { useTranscriptState } from '../TranscriptProvider/transcriptContext';
import { trimRecap } from 'utils/recapPrompt';
import { WatchModal, WatchModalRef } from '../WatchModal';
import styles from './transcript.module.scss';

interface RecapButtonProps {
	text: string;
	ariaLabel: string;
	icon: React.ReactNode;
	loadingSpinner: React.ReactNode;
}

export const RecapButton = ({
	text,
	ariaLabel,
	icon,
	loadingSpinner,
}: RecapButtonProps) => {
	const {
		isExpanded,
		captions,
		videoDetails: { title, keywords, chapters, description },
	} = useTranscriptState();

	const [generatedRecap, setGeneratedRecap] = useState('');
	const [isRecapFinished, setIsRecapFinished] = useState(false);
	const [isLoading, setLoading] = useState(false);

	const modalRef = useRef<WatchModalRef>(null);

	const handleShowRecap = useCallback(async () => {
		modalRef.current?.open();

		if (isRecapFinished) {
			return;
		}

		setGeneratedRecap('');
		setLoading(true);

		const response = await fetch('/api/generateRecap', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				title,
				keywords,
				chapters,
				description,
				captions,
			}),
		});

		if (!response.ok) {
			throw new Error(response.statusText);
		}

		const data = response.body;
		if (!data) {
			return;
		}

		const reader = data.getReader();
		const decoder = new TextDecoder();
		let done = false;

		setLoading(false);

		while (!done) {
			const { value, done: doneReading } = await reader.read();
			done = doneReading;
			const chunkValue = decoder.decode(value);
			setGeneratedRecap((prev) => prev + chunkValue);
		}

		if (done) {
			setIsRecapFinished(true);
		}
	}, [captions, chapters, description, keywords, title, isRecapFinished]);

	const trimmedRecap = trimRecap(generatedRecap);

	return (
		<>
			<button
				className={styles.recapButton}
				aria-label={ariaLabel}
				tabIndex={isExpanded ? -1 : 0}
				onClick={handleShowRecap}
			>
				{icon}
				{text}
			</button>
			<WatchModal
				ref={modalRef}
				loadingSpinner={loadingSpinner}
				isLoading={isLoading}
			>
				{trimmedRecap}
			</WatchModal>
		</>
	);
};
