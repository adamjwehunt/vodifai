import styled from '@emotion/styled';
import ChevronBackIcon from '../../../../public/chevron-back-icon.svg';
import { css } from '@emotion/react';
import { StyledComponent } from '../types';

interface MinimizeButtonProps extends StyledComponent {
	onClick: () => void;
}

const ChevronDownIcon = styled(ChevronBackIcon)`
	transform: rotate(-90deg);
	fill: #fff;
	margin-top: -0.3em;
`;

export const MinimizeButton = styled(
	({ onClick, className }: MinimizeButtonProps) => (
		<button
			className={className}
			aria-label={'Menu'}
			color="primary"
			onClick={onClick}
		>
			<ChevronDownIcon />
		</button>
	)
	)(css`
	background-color: hsla(0, 0%, 0%, 0.3);
	height: 2rem;
	width: 2rem;
	border-radius: 50%;
	padding: 0 0.4rem;
`);
