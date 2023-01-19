import { useMemo } from 'react';

const debounce = (callback: () => void, delay: number, immediate?: boolean) => {
	let timeout: NodeJS.Timeout | null;

	return function (...args: []) {
		const context = this;
		const later = () => {
			timeout = null;
			if (!immediate) {
				callback.apply(context, args);
			}
		};
		const callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, delay);
		if (callNow) {
			callback.apply(context, args);
		}
	};
};

export const useDebounce = (callback: () => void, delay: number) => {
	return useMemo(() => debounce(callback, delay), [callback, delay]);
};
