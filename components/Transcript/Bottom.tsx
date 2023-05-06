'use client';

import { CSSProperties, ReactNode } from 'react';
import {
	useTranscriptState,
	useTranscriptStateDispatch,
} from '../TranscriptProvider/transcriptContext';
import { useMediaQuery } from 'react-responsive';
import { EXPAND_DURATION } from '../PlayerProvider';
import { TRANSCRIPT_CONTROLS_HEIGHT } from './TranscriptControls';
import dynamic from 'next/dynamic';
const MotionDiv = dynamic(
	() => import('framer-motion').then((mod) => mod.motion.div),
	{
		ssr: false,
	}
);
import styles from './transcript.module.scss';

const COLLAPSED_TOP = 'calc(100dvh - 2.5rem)';
const COLLAPSED_BOTTOM = '-20rem';
const COLLAPSED_BORDER_RADIUS = '0.3rem';
const EXPANDED_TOP = '5rem';
const DESKTOP_PADDING = '20dvw';
const BASE_PADDING = '4.5dvw';

interface BottomProps {
	children: ReactNode;
}

export const Bottom = ({ children }: BottomProps) => {
	const transcriptStateDispatch = useTranscriptStateDispatch();
	const { isExpanded } = useTranscriptState();
	const isDesktop = useMediaQuery({ minWidth: 1224 });

	const handleAnimationStart = () =>
		transcriptStateDispatch({ type: 'animateStart' });
	const handleAnimationComplete = () =>
		transcriptStateDispatch({ type: 'animateComplete' });
	const handleAnimationUpdate = () => {
		handleAnimationStart();
		setTimeout(() => {
			handleAnimationComplete();
		}, EXPAND_DURATION + 0.2);
	};

	const horizontalPadding = isDesktop ? DESKTOP_PADDING : BASE_PADDING;
	const expandedContainerStyles: CSSProperties = {
		inset: `${EXPANDED_TOP} 0 0 0`,
		borderRadius: 0,
	};
	const collapsedContainerStyles: CSSProperties = {
		inset: `${COLLAPSED_TOP} ${horizontalPadding} ${COLLAPSED_BOTTOM}`,
		borderRadius: COLLAPSED_BORDER_RADIUS,
	};
	const expandedWrapperStyles: CSSProperties = {
		top: EXPANDED_TOP,
		bottom: TRANSCRIPT_CONTROLS_HEIGHT,
		left: horizontalPadding,
		right: horizontalPadding,
	};
	const collapsedWrapperStyles: CSSProperties = {
		top: COLLAPSED_TOP,
		bottom: COLLAPSED_BOTTOM,
		left: horizontalPadding,
		right: horizontalPadding,
	};
	const expandedChildrenStyles: CSSProperties = {
		paddingTop: 0,
	};

	return (
		<>
			<MotionDiv
				className={styles.container}
				style={isExpanded ? expandedContainerStyles : collapsedContainerStyles}
				onUpdate={handleAnimationUpdate}
			/>
			<MotionDiv
				className={styles.childrenWrapper}
				style={isExpanded ? expandedWrapperStyles : collapsedWrapperStyles}
			>
				<MotionDiv
					className={styles.children}
					style={isExpanded ? expandedChildrenStyles : {}}
				>
					{children}
				</MotionDiv>
			</MotionDiv>
		</>
	);
};
