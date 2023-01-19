import styled from '@emotion/styled';
import { StyledComponent } from '../types';
import { usePlayerState } from '../PlayerProvider/playerContext';
import { useTranscriptState } from '../TranscriptProvider/transcriptContext';
import { AnimatePresence, motion } from 'framer-motion';
import { SearchTranscriptButton } from './SearchTranscriptButton';
import { MinimizeButton } from './MinimizeButton';
import { css } from '@emotion/react';

const Info = styled.div`
	padding: 0 1rem;
	overflow: hidden;
	text-align: center;
	white-space: nowrap;
	line-height: 1.45rem;
	letter-spacing: 0.03rem;

	> div {
		overflow: hidden;
		text-overflow: ellipsis;
	}

	div:first-of-type {
		font-weight: 600;
	}
`;

export const Top = styled(({ className }: StyledComponent) => {
	const { isExpanded } = useTranscriptState();
	const {
		videoInfo: {
			videoDetails: {
				title,
				author: { name: authorName },
			},
		},
	} = usePlayerState();

	const handleSearchTranscriptButtonClick = () => {};

	if (!isExpanded) {
		// Animates exit
		return <AnimatePresence />;
	}

	return (
		<AnimatePresence>
			{
				<motion.div
					className={className}
					initial={{ y: '-5rem', opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					exit={{ y: '-5rem', opacity: 0 }}
				>
					<SearchTranscriptButton onClick={handleSearchTranscriptButtonClick} />
					<Info>
						<div>{title}</div>
						<div>{authorName}</div>
					</Info>
					<MinimizeButton />
				</motion.div>
			}
		</AnimatePresence>
	);
})(css`
	position: absolute;
	left: 0;
	right: 0;
	z-index: 3;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1rem;
	background-color: rgb(185, 153, 190);
`);
