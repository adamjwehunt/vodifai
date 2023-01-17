import styled from '@emotion/styled';
import { StyledComponent } from '../types';
import Icon from '../../../../public/expand-icon.svg';
import { css } from '@emotion/react';

const ExpandIcon = styled(Icon)`
	display: flex;
	height: 100%;
	fill: #fff;
	max-width: 100%;
`;

interface ExpandButtonProps extends StyledComponent {
	onClick: () => void;
}

export const ExpandButton = styled(
	({ onClick, className }: ExpandButtonProps) => (
		<button className={className} aria-label={'Menu'} onClick={onClick}>
			<ExpandIcon />
		</button>
	)
)(css`
	background-color: hsla(0, 0%, 0%, 0.3);
	border-radius: 50%;
	padding: 0.3rem;
	height: 100%;
`);
