import styled from '@emotion/styled';
import { StyledComponent } from '../types';
import { SkipButton } from './SkipButton';
import { PlayPause } from './PlayPause';
import { css } from '@emotion/react';

export const ControlsButtons = styled(({ className }: StyledComponent) => (
	<div className={className}>
		<SkipButton back />
		<PlayPause />
		<SkipButton />
	</div>
))(css`
	display: flex;
	gap: 32px;
`);
