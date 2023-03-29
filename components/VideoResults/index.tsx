'use client';

import { ReactElement } from 'react';
import { Fade } from '../Fade';
import styles from './videoResults.module.scss';

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
		<Fade className={styles.searchResults} foreground>
			{children}
		</Fade>
	</>
);
