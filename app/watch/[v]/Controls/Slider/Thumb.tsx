import * as Slider from '@radix-ui/react-slider';
import styled from '@emotion/styled';

export const Thumb = styled(Slider.Thumb)`
	display: block;
	width: 0.75rem;
	height: 0.75rem;
	background-color: white;
	box-shadow: 0 0 1rem rgba(0, 0, 0, 0.5);
	border-radius: 50%;

	&:active,
	&:focus-visible {
		outline: none;
	}
`;
