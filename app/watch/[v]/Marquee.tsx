'use client';

import { ReactNode, useRef } from 'react';
import styles from './watch.module.scss';

interface MarqueeProps {
	children: ReactNode;
	className?: string;
}
export const Marquee = ({ children, className }: MarqueeProps) => {
	const MarqueeWrapperRef = useRef<HTMLInputElement>(null);
	const textRef = useRef<HTMLInputElement>(null);

	return (
		<div ref={MarqueeWrapperRef} className={styles.marqueeWrapper}>
			<div ref={textRef} className={styles.marqueeText}>
				<span className={className}>{children}</span>
			</div>
		</div>
	);
};
