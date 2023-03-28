'use client';

import { Fade, DEFAULT_FOREGROUND_DURATION, DEFAULT_FOREGROUND_DELAY } from 'components/Fade';
import { ReactElement } from 'react';
import styles from './watchPageContainer.module.scss';

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
