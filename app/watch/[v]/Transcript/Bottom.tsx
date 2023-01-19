import { Ref } from 'react';
import styled from '@emotion/styled';
import { StyledComponent } from '../types';
import { usePlayerState } from '../PlayerProvider/playerContext';
import { useActiveCaptionId } from './hooks/useActiveCaptionId';
import { motion } from 'framer-motion';
import { TranscriptHeader } from './TranscriptHeader';
import { Captions, CaptionsHandle } from './Captions';
import { css } from '@emotion/react';

interface BottomProps extends StyledComponent {
	captionsRef: Ref<CaptionsHandle>;
	isExpanded: boolean;
	onToggleExpand: () => void;
}

export const Bottom = styled(
	({ className, captionsRef, isExpanded, onToggleExpand }: BottomProps) => {
		const {
			played,
			videoInfo: { captions },
		} = usePlayerState();
		useActiveCaptionId(captions, played);
		const { activeCaptionId, handleAnimationStart, handleAnimationComplete } =
			useActiveCaptionId(captions, played);

		return (
			<motion.div
				className={className}
				onAnimationStart={handleAnimationStart}
				onAnimationComplete={handleAnimationComplete}
				animate={{
					...(isExpanded && {
						top: '8dvh',
						bottom: 0,
						left: 0,
						right: 0,
						paddingTop: 0,
						paddingBottom: '21dvh',
					}),
				}}
			>
				<TranscriptHeader onToggleExpand={onToggleExpand} />
				<Captions ref={captionsRef} activeCaptionId={activeCaptionId} />
			</motion.div>
		);
	}
)(css`
	position: absolute;
	top: calc(100dvh - 2.3rem);
	bottom: -300px;
	left: 4.5dvw;
	right: 4.5dvw;
	z-index: 2;
	display: flex;
	background: rgb(185, 153, 190);
	flex-direction: column;
	padding-top: 3rem;
	padding-bottom: 0;
	border-radius: 0.3rem;
`);
