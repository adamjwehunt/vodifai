import styled from '@emotion/styled';
import { StyledComponent } from '../types';
import Icon from '../../../../public/search-icon.svg';
import { css } from '@emotion/react';

const SearchIcon = styled(Icon)`
	display: flex;
	height: 100%;
	fill: #fff;
	max-width: 100%;
`;

interface SearchTranscriptButtonProps extends StyledComponent {
	onClick: () => void;
}

export const SearchTranscriptButton = styled(
	({ onClick, className }: SearchTranscriptButtonProps) => (
		<button className={className} aria-label={'Menu'} onClick={onClick}>
			<SearchIcon />
		</button>
	)
)(css`
	height: 2rem;
	width: 2rem;
	padding: 0 0.275rem;
`);
