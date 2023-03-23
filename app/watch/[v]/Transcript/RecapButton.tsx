'use client';

import {  ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { ClipboardButton } from '../ClipboardButton';
import { useTranscriptState } from '../TranscriptProvider/transcriptContext';
import { Modal, ModalRef } from '../../../components/Modal';
import { TextToSpeech, TextToSpeechRef } from './TextToSpeech';
import ClipboardIcon from '@/public/clipboard-icon.svg';
import PlayIcon from '@/public/play-icon.svg';
import PauseIcon from '@/public/pause-icon.svg';
import styles from './transcript.module.scss';
import { trimRecap } from './util';

interface RecapButtonProps {
	ariaLabel: string;
	children: ReactNode;
	modalTitle: string;
	loadingSpinner: ReactNode;
}

export const RecapButton = ({
	ariaLabel,
	children,
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

	const modalRef = useRef<ModalRef>(null);
	const textToSpeechRef = useRef<TextToSpeechRef>(null);

	useEffect(() => {
		return () => {
			setIsTextToSpeechPlaying(false);
		};
	}, []);

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

	const handleModalClose = () => setIsTextToSpeechPlaying(false);

	const trimmedRecap = trimRecap(generatedRecap);

	return (
		<>
			<button
				className={styles.recapButton}
				aria-label={ariaLabel}
				tabIndex={isExpanded ? -1 : 0}
				onClick={handleShowRecap}
			>
				{children}
			</button>
			<Modal
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
							{!isTextToSpeechPlaying ? <PlayIcon /> : <PauseIcon />}
						</button>
					)
				}
				buttonRight={
					!isRecapFinished ? null : (
						<ClipboardButton
							ariaLabel={'Copy Recap'}
							toast={'Recap copied to clipboard'}
							icon={<ClipboardIcon style={{ maxHeight: '1.75rem' }} />}
							text={trimmedRecap}
						/>
					)
				}
				onClose={handleModalClose}
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
			</Modal>
		</>
	);
};
