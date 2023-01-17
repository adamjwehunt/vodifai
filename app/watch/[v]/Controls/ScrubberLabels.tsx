
import styled from '@emotion/styled';
import { StyledComponent } from '../types';
import { PlayedLabel } from './PlayedLabel';
import { TimeLeftLabel } from './TimeLeftLabel';
import { css } from '@emotion/react';

export const ScrubberLabels = styled(({ className }: StyledComponent) => (
	<div className={className}>
		<PlayedLabel />
		<TimeLeftLabel />
	</div>
))(css`
	display: flex;
	align-items: center;
	justify-content: space-between;
	opacity: 0.7;
	font-size: 0.75rem;
`);
