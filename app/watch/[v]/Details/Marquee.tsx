import { useRef } from 'react';
import styled from '@emotion/styled';
import { SerializedStyles } from '@emotion/react';
import { StyledComponent } from '../types';

const MarqueeWrapper = styled.div`
	width: 100%;
	overflow: hidden;
`;

const Text = styled.div`
	text-align: justify;
	white-space: nowrap;
`;

interface MarqueeProps extends StyledComponent {
	text?: string;
	textStyle?: SerializedStyles;
}

export const Marquee = styled(({ className, text }: MarqueeProps) => {
	const MarqueeWrapperRef = useRef<HTMLInputElement>(null);
	const textRef = useRef<HTMLInputElement>(null);

	return (
		<MarqueeWrapper ref={MarqueeWrapperRef}>
			<Text ref={textRef} className={className}>
				{text ?? ''}
			</Text>
		</MarqueeWrapper>
	);
})(({ textStyle }) => textStyle);
