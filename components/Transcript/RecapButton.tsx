'use client';

import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { useCompletion } from 'ai/react'; // <-- from npm install ai
import { ClipboardButton } from '../ClipboardButton';
import { useTranscriptState } from '../TranscriptProvider/transcriptContext';
import { TextToSpeech, TextToSpeechRef } from './TextToSpeech';
import ClipboardIcon from '@/public/clipboard-icon.svg';
import PlayIcon from '@/public/play-icon.svg';
import PauseIcon from '@/public/pause-icon.svg';
import { trimRecap } from './util';
import { Modal, ModalRef } from '@/components/Modal';
import styles from './transcript.module.scss';

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

	const [isRecapFinished, setIsRecapFinished] = useState(false);
	const [isTextToSpeechPlaying, setIsTextToSpeechPlaying] = useState(false);

	// We no longer manually track 'generatedRecap' while streaming, because
	// `useCompletion` gives us a `completion` string that updates with each token.
	// If you prefer storing it yourself, you can do so with `onResponse` or `onFinish`.
	// But for the minimal approach, we'll show partial text via `completion`.

	// This hook does the SSE streaming behind the scenes.
	const {
		completion, // partial or complete text from the AI
		isLoading, // true while streaming
		error,
		complete, // function to trigger the request
		setCompletion, // if needed to manually reset the text
	} = useCompletion({
		api: '/api/recap', // the route we call
		body: {
			// We pass your YT data up front, so the route knows how to build the prompt:
			title,
			keywords,
			chapters,
			description,
			captions,
		},
		onFinish: (prompt, finalText) => {
			// Called once the stream is fully done
			setIsRecapFinished(true);
			// Optionally do something else here:
			// console.log('Finished Recap. Full text is:', finalText);
		},
	});

	const modalRef = useRef<ModalRef>(null);
	const textToSpeechRef = useRef<TextToSpeechRef>(null);

	// Stop TTS if we unmount
	useEffect(() => {
		return () => setIsTextToSpeechPlaying(false);
	}, []);

	const handleShowRecap = useCallback(async () => {
		// Open the modal
		modalRef.current?.open();

		// If we've already finished once, do nothing
		if (isRecapFinished) {
			return;
		}

		// Reset partial text & states
		setCompletion('');
		setIsRecapFinished(false);

		// Trigger the SSE request
		await complete('');
	}, [complete, isRecapFinished, setCompletion]);

	const handleToggleTextToSpeech = () => {
		if (!isTextToSpeechPlaying) {
			textToSpeechRef.current?.play();
		} else {
			textToSpeechRef.current?.pause();
		}
		setIsTextToSpeechPlaying(!isTextToSpeechPlaying);
	};

	const handleModalClose = () => {
		setIsTextToSpeechPlaying(false);
	};

	// We'll "trim" the partial or final text from the AI
	const trimmedRecap = trimRecap(completion);

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
				{error && (
					<p style={{ color: 'red', marginBottom: '1rem' }}>
						Error: {error.message}
					</p>
				)}

				{/**
				 * If the stream hasn't fully finished, we still show partial text
				 * (i.e. `trimmedRecap`).
				 * Once `isRecapFinished` is true, we also allow TTS & copying.
				 */}
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
