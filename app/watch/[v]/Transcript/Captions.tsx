import React, {
	ForwardedRef,
	forwardRef,
	memo,
	useCallback,
	useImperativeHandle,
	useRef,
} from 'react';
import {
	usePlayerStateDispatch,
	usePlayerRef,
	usePlayerState,
} from '../PlayerProvider/playerContext';
import { Caption } from '../types';
import { useIsScrolling } from './hooks/useIsScrolling';
import { expandDuration } from '.';
import { useActiveCaptionId } from './hooks/useActiveCaptionId';
import { useTranscriptState } from '../TranscriptProvider/transcriptContext';
import { CaptionText } from './CaptionText';
import styles from './transcript.module.scss';

export interface CaptionsHandle {
	centerActiveCaption: () => void;
}

export const Captions = memo(
	forwardRef(({}, ref: ForwardedRef<CaptionsHandle>) => {
		const playerStateDispatch = usePlayerStateDispatch();
		const { seekTo } = usePlayerRef();
		const { played, isPlaying, isSeeking, hasSeeked } = usePlayerState();
		const { isAnimating, captions } = useTranscriptState();
		const containerRef = useRef<HTMLDivElement>(null);
		const activeCaptionRef = useRef<HTMLDivElement | null>(null);
		const isScrolling = useIsScrolling(containerRef?.current, 1000);
		const activeCaptionId = useActiveCaptionId(captions, played, isAnimating);

		useImperativeHandle(ref, () => ({
			centerActiveCaption() {
				setTimeout(() => {
					if (activeCaptionRef.current) {
						scrollToCaption(activeCaptionRef.current);
					}
				}, expandDuration * 1000);
			},
		}));

		const scrollToCaption = useCallback(
			(caption: HTMLDivElement, isSmooth = true) => {
				const container = containerRef?.current;
				if (caption && container) {
					const captionComputedStyle = getComputedStyle(caption);
					const captionPaddingY = parseFloat(
						captionComputedStyle.paddingBottom
					);
					const captionHeight = caption.offsetHeight - captionPaddingY;

					container.scrollTo({
						top:
							caption.offsetTop - (container.offsetHeight - captionHeight) / 2,
						...(isSmooth && { behavior: 'smooth' }),
					});
				}
			},
			[]
		);

		const handleActiveCaptionChange = useCallback(
			(caption: HTMLDivElement) => {
				activeCaptionRef.current = caption;

				if (isSeeking || hasSeeked) {
					return scrollToCaption(caption, false);
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
			captionStart = captionStart < 1 ? Math.ceil(captionStart) : captionStart;
			scrollToCaption(element);
			seekTo(captionStart);
			playerStateDispatch({ type: 'played', seconds: captionStart });
		};

		return (
			<div className={styles.captionsWrapper}>
				<div className={styles.captions} ref={containerRef}>
					{captions.map(({ start, text, id }: Caption, i: number) => (
						<CaptionText
							key={i}
							isHighlighted={
								activeCaptionId !== undefined ? id <= activeCaptionId : false
							}
							captionRef={
								id === activeCaptionId ? handleActiveCaptionChange : null
							}
							onClick={({ target }) => {
								handleCaptionClick(target as HTMLDivElement, start);
							}}
							text={text}
						/>
					))}
				</div>
			</div>
		);
	})
);
