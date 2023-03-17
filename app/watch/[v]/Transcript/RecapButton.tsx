'use client';

import { trimRecap } from 'app/api/recap/recapPrompt';
import { useCallback, useRef, useState } from 'react';
import { ClipboardButton } from '../ClipboardButton';
import { useTranscriptState } from '../TranscriptProvider/transcriptContext';
import { WatchModal, WatchModalRef } from '../WatchModal';
import { TextToSpeech, TextToSpeechRef } from './TextToSpeech';
import ClipboardIcon from '@/public/clipboard-icon.svg';
import AudioIcon from '@/public/audio-icon.svg';
import PauseAudioIcon from '@/public/pause-audio-icon.svg';
import styles from './transcript.module.scss';

interface RecapButtonProps {
	text: string;
	ariaLabel: string;
	icon: React.ReactNode;
	modalTitle: string;
	loadingSpinner: React.ReactNode;
}

export const RecapButton = ({
	text,
	ariaLabel,
	icon,
	modalTitle,
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
	const [isTextToSpeechPlaying, setIsTextToSpeechPlaying] = useState(false);

	const modalRef = useRef<WatchModalRef>(null);
	const textToSpeechRef = useRef<TextToSpeechRef>(null);

	const handleShowRecap = useCallback(async () => {
		modalRef.current?.open();

		if (isRecapFinished) {
			return;
		}

		setGeneratedRecap('');
		setLoading(true);

		const response = await fetch('/api/recap', {
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

	const handleToggleTextToSpeech = () =>
		!isTextToSpeechPlaying
			? textToSpeechRef.current?.play()
			: textToSpeechRef.current?.pause();

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
				title={modalTitle}
				loadingSpinner={loadingSpinner}
				isLoading={isLoading}
				buttonLeft={
					!isRecapFinished ? null : (
						<button
							aria-label={'Play Recap'}
							onClick={handleToggleTextToSpeech}
						>
							{!isTextToSpeechPlaying ? <AudioIcon /> : <PauseAudioIcon />}
						</button>
					)
				}
				buttonRight={
					!isRecapFinished ? null : (
						<ClipboardButton
							ariaLabel={'Copy Recap'}
							toast={'Recap copied to clipboard'}
							icon={<ClipboardIcon />}
							text={trimmedRecap}
						/>
					)
				}
			>
				{!isRecapFinished ? (
					trimmedRecap
				) : (
					<TextToSpeech
						onStart={() => setIsTextToSpeechPlaying(true)}
						onPause={() => setIsTextToSpeechPlaying(false)}
						onEnd={() => setIsTextToSpeechPlaying(false)}
						ref={textToSpeechRef}
					>
						{trimmedRecap}
					</TextToSpeech>
				)}
			</WatchModal>
		</>
	);
};
