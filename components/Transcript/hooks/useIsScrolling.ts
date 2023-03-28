import { useCallback, useEffect, useState } from 'react';
import { useDebounce } from './useDebounce';

const useOnScroll = (callback: () => void, element: HTMLElement | null) => {
	useEffect(() => {
		element?.addEventListener('scroll', callback);

		return () => {
			element?.removeEventListener('scroll', callback);
		};
	}, [callback, element]);
};

export const useIsScrolling = (element: HTMLElement | null, delay = 100) => {
	const [isScrolling, setIsScrolling] = useState(false);

	const onScroll = useCallback(() => {
		setIsScrolling(true);
	}, []);

	const onScrollEnd = useCallback(() => {
		setIsScrolling(false);
	}, []);

	useOnScroll(onScroll, element);

	useOnScroll(useDebounce(onScrollEnd, delay), element);

	return isScrolling;
};
