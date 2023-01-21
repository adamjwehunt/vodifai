'use client';

import { ReactNode, useRef } from 'react';
import styled from '@emotion/styled';

const MarqueeWrapper = styled.div`
	width: 100%;
	overflow: hidden;
`;

const Text = styled.div`
	text-align: justify;
	white-space: nowrap;
`;

interface MarqueeProps {
	children: ReactNode;
	className?: string;
}
export const Marquee = ({ children, className }: MarqueeProps) => {
	const MarqueeWrapperRef = useRef<HTMLInputElement>(null);
	const textRef = useRef<HTMLInputElement>(null);

	return (
		<MarqueeWrapper ref={MarqueeWrapperRef}>
			<Text ref={textRef}>
				<span className={className}>{children}</span>
			</Text>
		</MarqueeWrapper>
	);
};
