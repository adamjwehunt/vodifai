import { AnimatePresence, motion } from 'framer-motion';
import { ReactElement } from 'react';

const DEFAULT_DURATION = 0.2;
const DEFAULT_DELAY = 0;
export const DEFAULT_FOREGROUND_DURATION = 0.1;
export const DEFAULT_FOREGROUND_DELAY = 0.1;

interface FadeInProps {
	duration?: number;
	delay?: number;
	className?: string;
	style?: React.CSSProperties;
	children?: ReactElement | ReactElement[];
}

export const FadeIn = ({
	duration = DEFAULT_DURATION,
	delay = DEFAULT_DELAY,
	className,
	style,
	children,
}: FadeInProps) => (
	<AnimatePresence>
		<motion.div
			className={className}
			style={style}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration, delay }}
		>
			{children}
		</motion.div>
	</AnimatePresence>
);
