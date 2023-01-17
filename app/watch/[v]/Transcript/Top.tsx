import styled from '@emotion/styled';
import { StyledComponent } from '../types';
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

interface TopProps extends StyledComponent {
	title: string;
	artist: string;
	isExpanded: boolean;
	onToggleExpand: () => void;
}

export const Top = styled(
	({ title, artist, className, isExpanded, onToggleExpand }: TopProps) => {
		if (!isExpanded) {
			return null;
		}

		const handleSearchTranscriptButtonClick = () => {};

		return (
			<AnimatePresence>
				<motion.div
					className={className}
					initial={{ y: '-5rem', opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					exit={{ y: '-5rem', opacity: 0 }}
				>
					<SearchTranscriptButton onClick={handleSearchTranscriptButtonClick} />
					<Info>
						<div>{title}</div>
						<div>{artist}</div>
					</Info>
					<MinimizeButton onClick={onToggleExpand} />
				</motion.div>
			</AnimatePresence>
		);
	}
)(css`
	position: absolute;
	left: 0;
	right: 0;
	z-index: 3;
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	padding: 1rem;
	background-color: rgb(185, 153, 190);
`);
