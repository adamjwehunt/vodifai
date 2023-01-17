import styled from '@emotion/styled';
import { StyledComponent } from './types';
import { Details } from './Details';
import { Controls } from './Controls';
import { SecondaryControls } from './SecondaryControls';
import { css } from '@emotion/react';

interface PlayerTrayProps extends StyledComponent {
	videoDetails: any;
}

export const PlayerTray = styled(
	({ videoDetails, className }: PlayerTrayProps) => (
		<div className={className}>
			<Details videoDetails={videoDetails} />
			<Controls />
			<SecondaryControls />
		</div>
	)
)(css`
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
