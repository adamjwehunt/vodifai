import styled from '@emotion/styled';
import { StyledComponent } from '../types';
import { Scrubber } from './Scrubber';
import { ControlsButtons } from './ControlsButtons';
import { css } from '@emotion/react';

export const Controls = styled(({ className }: StyledComponent) => (
	<div className={className}>
		<Scrubber />
		<ControlsButtons />
	</div>
))(css`
	display: flex;
	width: 100%;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`);
