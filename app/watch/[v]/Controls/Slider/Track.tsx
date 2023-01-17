import styled from '@emotion/styled';
import * as Slider from '@radix-ui/react-slider';
import { css } from '@emotion/react';
import { StyledComponent } from '../../types';
import { Range } from './Range';

export const Track = styled(({ className }: StyledComponent) => {
	return (
		<Slider.Track className={className}>
			<Range />
		</Slider.Track>
	);
})(css`
	height: 0.25rem;
	background-color: hsla(0, 0%, 100%, 0.3);
	position: relative;
	flex-grow: 1;
	border-radius: 9999px;
`);

