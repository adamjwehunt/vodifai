import styled from '@emotion/styled';
import { StyledComponent } from '../types';
import { RefObject } from 'react';
import {
	useTranscriptState,
	useTranscriptStateDispatch,
} from '../TranscriptProvider/transcriptContext';
import { motion } from 'framer-motion';
import { TranscriptHeader } from './TranscriptHeader';
import { Captions, CaptionsHandle } from './Captions';
import { css } from '@emotion/react';

interface BottomProps extends StyledComponent {
	captionsRef: RefObject<CaptionsHandle>;
}

export const Bottom = styled(({ className, captionsRef }: BottomProps) => {
	const { isExpanded } = useTranscriptState();
	const transcriptStateDispatch = useTranscriptStateDispatch();

	return (
		<motion.div
			className={className}
			onAnimationStart={() => transcriptStateDispatch({ type: 'animateStart' })}
			onAnimationComplete={() =>
				transcriptStateDispatch({ type: 'animateEnd' })
			}
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
			<TranscriptHeader />
			<Captions ref={captionsRef} />
		</motion.div>
	);
})(css`
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
