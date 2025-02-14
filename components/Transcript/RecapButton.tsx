'use client';

import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { useCompletion } from '@ai-sdk/react';
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
	modalTitle: string;
	loadingSpinner: ReactNode;
}

export const RecapButton = ({
	ariaLabel,
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

	const { completion, isLoading, error, complete, setCompletion } =
		useCompletion({
			api: '/api/recap',
			body: {
				title,
				keywords,
				chapters,
				description,
				captions,
			},
			onFinish: (prompt, finalText) => {
				setIsRecapFinished(true);
			},
		});

	const modalRef = useRef<ModalRef>(null);
	const textToSpeechRef = useRef<TextToSpeechRef>(null);

	useEffect(() => {
		return () => setIsTextToSpeechPlaying(false);
	}, []);

	const handleShowRecap = useCallback(async () => {
		modalRef.current?.open();

		if (isRecapFinished) {
			return;
		}

		setCompletion('');
		setIsRecapFinished(false);

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

	const trimmedRecap = trimRecap(completion);

	return (
		<>
			<button
				className={styles.recapButton}
				aria-label={ariaLabel}
				tabIndex={isExpanded ? -1 : 0}
				onClick={handleShowRecap}
			>
				{'✨ Recap'}
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
