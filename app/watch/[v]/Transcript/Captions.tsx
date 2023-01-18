import React, { memo, useCallback, useRef } from 'react';
import styled from '@emotion/styled';
import {
	usePlayerStateDispatch,
	usePlayerRef,
	usePlayerState,
} from '../PlayerProvider/playerContext';
import { Caption, StyledComponent } from '../types';
import { CaptionText } from './CaptionText';
import { css } from '@emotion/react';
import useIsScrolling from './hooks/useIsScrolling';

const CaptionsContainer = styled.div`
	overflow-y: scroll;
	width: 100%;
	padding: 1rem 0;

	&::-webkit-scrollbar {
		display: none;
	}
`;

interface CaptionsProps extends StyledComponent {
	captions: Caption[];
	activeCaptionId?: number;
}

export const Captions = memo(
	styled(({ className, captions, activeCaptionId }: CaptionsProps) => {
		const playerStateDispatch = usePlayerStateDispatch();
		const { seekTo } = usePlayerRef();
		const { isPlaying, isSeeking, hasSeeked } = usePlayerState();
		const containerRef = useRef<HTMLDivElement>(null);
		const isScrolling = useIsScrolling(containerRef?.current, 1000);

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
				if (isSeeking || hasSeeked) {
					return scrollToCaption(caption, false);
				}

				if (isScrolling && isPlaying) {
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
			scrollToCaption(element);
			seekTo(captionStart);
			playerStateDispatch({ type: 'played', seconds: captionStart });
		};

		return (
			<div className={className}>
				<CaptionsContainer ref={containerRef}>
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
				</CaptionsContainer>
			</div>
		);
	})(() => {
		const pseudoElementBase = (location: 'top' | 'bottom') => css`
			content: '';
			position: absolute;
			left: 0;
			right: 0;
			${location}: 0;
			pointer-events: none;
			height: 1.75rem;
			z-index: 1;
			background-image: linear-gradient(
				to ${location},
				rgba(185, 153, 190, 0),
				rgb(185, 153, 190) 90%
			);
		`;

		return css`
			position: relative;
			height: 100%;
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			padding: 0.1rem 0;
			background-color: rgb(185, 153, 190);

			&:before {
				${pseudoElementBase('top')};
			}

			&:after {
				${pseudoElementBase('bottom')};
			}
		`;
	})
);
