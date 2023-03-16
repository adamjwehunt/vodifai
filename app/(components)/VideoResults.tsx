'use client';

import { ReactElement } from 'react';
import {
	DEFAULT_FOREGROUND_DELAY,
	DEFAULT_FOREGROUND_DURATION,
	Fade,
} from './Fade';
import styles from 'app/page.module.scss';

interface VideoResultsProps {
	backgroundImage: string;
	children: ReactElement | ReactElement[];
}

export const VideoResults = ({
	backgroundImage,
	children,
}: VideoResultsProps) => (
	<>
		<Fade className={styles.searchResults} style={{ backgroundImage }} />
		<Fade
			className={styles.searchResults}
			duration={DEFAULT_FOREGROUND_DURATION}
			delay={DEFAULT_FOREGROUND_DELAY}
		>
			{children}
		</Fade>
	</>
);
