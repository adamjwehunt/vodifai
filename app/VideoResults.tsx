'use client';

import { ReactElement } from 'react';
import {
	DEFAULT_FOREGROUND_DELAY,
	DEFAULT_FOREGROUND_DURATION,
	FadeIn,
} from './FadeIn';
import styles from './page.module.scss';

interface VideoResultsProps {
	backgroundImage: string;
	children: ReactElement | ReactElement[];
}

export const VideoResults = ({
	backgroundImage,
	children,
}: VideoResultsProps) => (
	<>
		<FadeIn className={styles.searchResults} style={{ backgroundImage }} />
		<FadeIn
			className={styles.searchResults}
			duration={DEFAULT_FOREGROUND_DURATION}
			delay={DEFAULT_FOREGROUND_DELAY}
		>
			{children}
		</FadeIn>
	</>
);
