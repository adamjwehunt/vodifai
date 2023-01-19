import styled from '@emotion/styled';
import { StyledComponent } from './types';
import { Details } from './Details';
import { Controls } from './Controls';
import { SecondaryControls } from './SecondaryControls';
import { css } from '@emotion/react';

export const PlayerTray = styled(({ className }: StyledComponent) => (
	<div className={className}>
		<Details />
		<Controls />
		<SecondaryControls />
	</div>
))(css`
	position: absolute;
	left: 4.5dvw;
	right: 4.5dvw;
	bottom: 3rem;
	display: flex;
	justify-content: space-between;
	align-items: end;
	flex-direction: column;
	background-color: transparent;
`);
