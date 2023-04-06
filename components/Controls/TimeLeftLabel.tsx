'use client';

import { usePlayerState } from '@/components/PlayerProvider/playerContext';
import { Children, cloneElement, ReactElement } from 'react';
import { formatPlayerTime } from './util';

interface TimeLeftLabelProps {
	label: ReactElement;
}

export const TimeLeftLabel = ({ label }: TimeLeftLabelProps) => {
	const {
		duration,
		played,
		videoInfo: { videoDetails },
	} = usePlayerState();
	const total = duration || videoDetails.duration;

	return cloneElement(
		Children.only(label),
		{},
		`${total === played ? '' : '-'}${formatPlayerTime(total - played)}`
	);
};
