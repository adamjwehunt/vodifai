import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import styles from './clipboardButton.module.scss';

const TOAST_BOTTOM_OFFSET = '-2.5rem';
const TOAST_DURATION = 3000;

interface ToastProps {
	message: string;
	onClose: () => void;
}

export const Toast = ({ message, onClose }: ToastProps) => {
	const controls = useAnimation();

	useEffect(() => {
		controls.start('visible');
		const timeoutId = setTimeout(onClose, TOAST_DURATION);

		return () => clearTimeout(timeoutId);
	}, [controls, onClose]);

	const handleToastClick = (e: React.MouseEvent<HTMLDivElement>) => {
		onClose();
		controls.start('hidden');
	};

	return (
		<motion.div
			className={styles.toast}
			initial={'hidden'}
			animate={controls}
			exit={'hidden'}
			style={{ bottom: TOAST_BOTTOM_OFFSET }}
			variants={{
				visible: { opacity: 1, y: TOAST_BOTTOM_OFFSET },
				hidden: { opacity: 0, y: 0 },
			}}
			transition={{ duration: 0.2 }}
			onClick={handleToastClick}
		>
			<span>{message}</span>
		</motion.div>
	);
};
