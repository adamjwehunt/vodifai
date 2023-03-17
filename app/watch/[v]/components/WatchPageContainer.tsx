'use client';

import { ReactElement } from 'react';
import {
	DEFAULT_FOREGROUND_DELAY,
	DEFAULT_FOREGROUND_DURATION,
	Fade,
} from 'app/components/Fade';
import styles from './watch.module.scss';

interface WatchPageContainerProps {
	background: string;
	style: React.CSSProperties;
	children: ReactElement;
}

export const WatchPageContainer = ({
	background,
	style,
	children,
}: WatchPageContainerProps) => (
	<div style={style}>
		<Fade className={styles.watchView} style={{ background }} />
		<Fade
			className={styles.watchView}
			duration={DEFAULT_FOREGROUND_DURATION}
			delay={DEFAULT_FOREGROUND_DELAY}
		>
			{children}
		</Fade>
	</div>
);
