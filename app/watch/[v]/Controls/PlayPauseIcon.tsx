import styled from '@emotion/styled';
import { StyledComponent } from '../types';
import { css } from '@emotion/react';

interface PlayPauseIconProps extends StyledComponent {
	icon: any;
}

export const PlayPauseIcon = styled(
	({ className, icon: Icon }: PlayPauseIconProps) => (
		<Icon className={className} />
	)
)(css`
	height: 100%;
	width: auto;
	fill: #fff;
`);
