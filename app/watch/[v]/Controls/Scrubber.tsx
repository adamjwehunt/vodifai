import styled from '@emotion/styled';
import { StyledComponent } from '../types';
import { Slider } from './Slider';
import { ScrubberLabels } from './ScrubberLabels';
import { css } from '@emotion/react';

const ScrubberContainer = styled.div`
	margin: auto;
	position: relative;
	z-index: 1;
`;

export const Scrubber = styled(({ className }: StyledComponent) => (
		<div className={className}>
			<ScrubberContainer>
				<Slider />
				<ScrubberLabels />
			</ScrubberContainer>
		</div>
	))(css`
	width: 100%;
	margin: 1rem 0;
`);
