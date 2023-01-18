import { motion } from 'framer-motion';
import { Captions } from './Captions';
import { TranscriptHeader } from './TranscriptHeader';
import styled from '@emotion/styled';
import useActiveCaptionId from './hooks/useActiveCaptionId';
import { Caption, StyledComponent } from '../types';
import { css } from '@emotion/react';
import { usePlayerState } from '../PlayerProvider/playerContext';

interface BottomProps extends StyledComponent {
	captions: Caption[];
	isExpanded: boolean;
	captionsRef: React.RefObject<HTMLDivElement>;
	onToggleExpand: () => void;
}

export const Bottom = styled(
	({
		className,
		captions,
		isExpanded,
		captionsRef,
		onToggleExpand,
	}: BottomProps) => {
		const { played } = usePlayerState();
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
				<Captions
					ref={captionsRef}
					activeCaptionId={activeCaptionId}
					captions={captions}
				/>
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
