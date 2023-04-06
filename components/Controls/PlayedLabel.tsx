'use client';

import { usePlayerState } from '@/components/PlayerProvider/playerContext';
import { Children, cloneElement, ReactElement } from 'react';
import { formatPlayerTime } from './util';

interface PlayedLabelProps {
	label: ReactElement;
}

export const PlayedLabel = ({ label }: PlayedLabelProps) => {
	const { played } = usePlayerState();

	return cloneElement(Children.only(label), {}, formatPlayerTime(played));
};
