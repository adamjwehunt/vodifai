'use client';

import React, {
	useCallback,
	useContext,
	useEffect,
	useImperativeHandle,
	useRef,
} from 'react';
import { usePlayerRef, usePlayerState } from '../PlayerProvider/playerContext';
import { Caption } from 'app/types';
import { useIsScrolling } from './hooks/useIsScrolling';
import { useActiveCaptionId } from './hooks/useActiveCaptionId';
import {
	CaptionsRefContext,
	useTranscriptState,
} from '../TranscriptProvider/transcriptContext';
import { EXPAND_DURATION } from '../PlayerProvider';
import styles from './transcript.module.scss';
import { stripTranscriptText } from './util';

export interface CaptionsHandle {
	centerActiveCaption: () => void;
}

export const Captions = () => {
	const { seekTo } = usePlayerRef();
	const { played, isPlaying, isSeeking, hasSeeked } = usePlayerState();
	const { isAnimating, captions, highlightedWord, centeredCaptionId } =
		useTranscriptState();
	const containerRef = useRef<HTMLDivElement>(null);
	const activeCaptionRef = useRef<HTMLDivElement | null>(null);
	const captionsRef = useContext(CaptionsRefContext);
	const isScrolling = useIsScrolling(containerRef?.current, 1000);
	const activeCaptionId = useActiveCaptionId(captions, played, isAnimating);

	useImperativeHandle(captionsRef, () => ({
		centerActiveCaption() {
			setTimeout(() => {
				if (activeCaptionRef.current) {
					scrollToCaption(activeCaptionRef.current);
				}
			}, EXPAND_DURATION * 1000);
		},
	}));

	const scrollToCaption = useCallback(
		(caption: HTMLDivElement | HTMLElement, isSmooth = true) => {
			const container = containerRef?.current;
			if (caption && container) {
				const captionComputedStyle = getComputedStyle(caption);
				const captionPaddingY = parseFloat(captionComputedStyle.paddingBottom);
				const captionHeight = caption.offsetHeight - captionPaddingY;

				container.scrollTo({
					top: caption.offsetTop - (container.offsetHeight - captionHeight) / 2,
					...(isSmooth && { behavior: 'smooth' }),
				});
			}
		},
		[]
	);

	useEffect(() => {
		if (centeredCaptionId !== null && highlightedWord) {
			const centeredCaption = document.getElementById(
				`caption-${centeredCaptionId}`
			);

			if (centeredCaption) {
				scrollToCaption(centeredCaption, false);
			}
		}
	}, [centeredCaptionId, highlightedWord, scrollToCaption]);

	const handleActiveCaptionChange = useCallback(
		(caption: HTMLDivElement) => {
			activeCaptionRef.current = caption;

			if (isSeeking || hasSeeked) {
				scrollToCaption(caption, false);
				return;
			}

			if (isScrolling || !isPlaying) {
				return;
			}

			scrollToCaption(caption);
		},
		[isScrolling, isPlaying, isSeeking, hasSeeked, scrollToCaption]
	);

	const handleCaptionClick = (
		element: HTMLDivElement,
		captionStart: number
	) => {
		const seconds = captionStart < 1 ? Math.ceil(captionStart) : captionStart;
		seekTo(seconds);

		// Prioritize seeking over scrolling
		setTimeout(() => {
			scrollToCaption(element);
		}, 0);
	};

	return (
		<div className={styles.captionsWrapper}>
			<div className={styles.captions} ref={containerRef}>
				{captions.map(({ start, text, id }: Caption, index: number) => {
					const words = highlightedWord
						? text
								// remove new lines
								.replace(/[\r\n]+/g, ' ')
								.trim()
								.split(' ')
								.map((word, index) =>
									stripTranscriptText(word) === highlightedWord ? (
										<span key={index}>
											<span
												style={{
													backgroundColor:
														centeredCaptionId === id ? 'orange' : 'yellow',
													color: 'initial',
												}}
											>
												{word}
											</span>{' '}
										</span>
									) : (
										<span key={index}>{word} </span>
									)
								)
						: text;

					const captionStyles =
						activeCaptionId !== undefined && id === activeCaptionId
							? { color: '#fff' }
							: activeCaptionId !== undefined && id <= activeCaptionId
							? { color: 'rgb(255, 255, 255, 0.65)' }
							: {};

					return (
						<div
							key={index}
							id={`caption-${id}`}
							ref={id === activeCaptionId ? handleActiveCaptionChange : null}
							className={styles.captionText}
							style={captionStyles}
							onClick={({ target }) => {
								handleCaptionClick(target as HTMLDivElement, start);
							}}
						>
							{words}
						</div>
					);
				})}
			</div>
		</div>
	);
};
