'use client';

import { Children, cloneElement } from 'react';
import { usePlayerState } from '../PlayerProvider/playerContext';
import { formatPlayerTime } from './util';

interface PlayedLabelProps {
	children: React.ReactElement;
}

export const PlayedLabel = ({ children }: PlayedLabelProps) => {
	const { played } = usePlayerState();

	return cloneElement(Children.only(children), {}, formatPlayerTime(played));
};
