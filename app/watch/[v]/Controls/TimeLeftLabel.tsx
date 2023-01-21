'use client';

import { Children, cloneElement } from 'react';
import { usePlayerState } from '../PlayerProvider/playerContext';
import { formatPlayerTime } from './util';

interface TimeLeftLabelProps {
	children: React.ReactElement;
}

export const TimeLeftLabel = ({ children }: TimeLeftLabelProps) => {
	const {
		duration,
		played,
		videoInfo: { videoDetails },
	} = usePlayerState();
	const total = duration || videoDetails.duration;

	return cloneElement(
		Children.only(children),
		{},
		`${total === played ? '' : '-'}${formatPlayerTime(total - played)}`
	);
};
