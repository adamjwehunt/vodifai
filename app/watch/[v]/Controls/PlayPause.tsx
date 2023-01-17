import styled from '@emotion/styled';
import { StyledComponent } from '../types';
import { PlayPauseButton } from './PlayPauseButton';
import { BufferSpinner } from './BufferSpinner';
import { css } from '@emotion/react';

export const PlayPause = styled(({ className }: StyledComponent) => (
	<div className={className}>
		<PlayPauseButton />
		<BufferSpinner />
	</div>
))(css`
	position: relative;
	height: 4.25rem;
	width: 4.25rem;
	display: flex;
`);
