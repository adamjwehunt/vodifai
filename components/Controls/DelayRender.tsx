'use client';

import { ReactNode, useEffect, useState } from 'react';

interface DelayRenderProps {
	children: ReactNode;
	seconds: number;
}

export const DelayRender = ({ children, seconds }: DelayRenderProps) => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const timeout = setTimeout(() => {
			setIsVisible(true);
		}, seconds * 1000);

		return () => clearTimeout(timeout);
	}, [isVisible, seconds]);

	return !isVisible ? null : <>{children}</>;
};
