'use client';

import React, { useLayoutEffect, useState } from 'react';

export const useIsOverflow = (
	ref: React.RefObject<HTMLElement>,
	callback: (hasOverflow: boolean) => {}
) => {
	const [isOverflow, setIsOverflow] = useState<boolean | undefined>(undefined);

	useLayoutEffect(() => {
		const { current } = ref;

		const trigger = () => {
			if (current) {
				const hasOverflow = current.scrollHeight > current.clientHeight;

				setIsOverflow(hasOverflow);

				if (callback) {
					callback(hasOverflow);
				}
			}
		};

		if (current) {
			trigger();
		}
	}, [callback, ref]);

	return isOverflow;
};
