import styled from '@emotion/styled';
import { StyledComponent } from '../types';
import { css } from '@emotion/react';

interface ScrubberLabelProps extends StyledComponent {
	text: string;
}

export const ScrubberLabel = styled(({ text }: ScrubberLabelProps) => (
	<div>{text}</div>
))(css`
	color: white;
	font-size: 0.75rem;
	opacity: 0.7;
	font-weight: 500;
	letter-spacing: 0.2;
`);
