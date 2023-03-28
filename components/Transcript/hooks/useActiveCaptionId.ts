import { Caption } from 'app/types';
import { useMemo, useRef } from 'react';

export const useActiveCaptionId = (
	captions: Caption[],
	played: number,
	isAnimating: boolean
): number | undefined => {
	const previousActiveCaptionId = useRef<number | undefined>();

	const activeCaptionId = useMemo(() => {
		// Prevents activeCaptionId from updating while animation is in progress
		if (isAnimating) {
			return previousActiveCaptionId.current;
		}

		const id = captions.find(
			({ start, duration }: { start: number; duration: number }, i: number) =>
				played === start ||
				(played >= start &&
					played < (captions[i + 1]?.start || start + duration))
		)?.id;

		previousActiveCaptionId.current = id;
		return id;
	}, [captions, played, isAnimating]);

	return activeCaptionId;
};
