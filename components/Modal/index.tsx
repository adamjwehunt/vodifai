'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import XIcon from '@/public/x-icon.svg';
import { createPortal } from 'react-dom';
import styles from './modal.module.scss';

interface ModalProps {
	title: string;
	children: React.ReactNode;
	isLoading?: boolean;
	loadingSpinner?: React.ReactNode;
	buttonLeft?: React.ReactNode;
	buttonRight?: React.ReactNode;
	onClose?: () => void;
}

export interface ModalRef {
	open: () => void;
}

export const Modal = forwardRef(function Modal(
	{
		title,
		children,
		isLoading,
		loadingSpinner,
		buttonLeft,
		buttonRight,
		onClose,
	}: ModalProps,
	ref
) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	useImperativeHandle(ref, () => ({
		open: () => setIsModalOpen(true),
	}));

	const handleCloseModal = () => {
		setIsModalOpen(false);
		onClose?.();
	};

	return !isClient
		? null
		: createPortal(
				<AnimatePresence>
					{!isModalOpen ? null : (
						<>
							<motion.div
								className={styles.modalBackdrop}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								onClick={handleCloseModal}
							/>
							<motion.div
								className={styles.modal}
								initial={{ top: '100dvh' }}
								animate={{ top: '5rem' }}
								exit={{ top: '100dvh' }}
							>
								<div className={styles.modalTop}>
									<div className={styles.modalTitle}>{title}</div>
									<button
										id={'watch-modal-close-button'}
										className={styles.closeButtonTop}
										aria-label={'Close recap'}
										onClick={handleCloseModal}
									>
										<XIcon className={styles.xIcon} />
									</button>
								</div>
								{isLoading ? (
									<div className={styles.loadingSpinner}>{loadingSpinner}</div>
								) : (
									<div className={styles.modalContent}>{children}</div>
								)}
								<div className={styles.modalBottom}>
									<div className={styles.buttonLeft}>{buttonLeft}</div>
									<button
										id={'watch-modal-close-button'}
										className={styles.closeButtonBottom}
										aria-label={'Close recap'}
										onClick={handleCloseModal}
									>
										{'Close'}
									</button>
									<div className={styles.buttonRight}>{buttonRight}</div>
								</div>
							</motion.div>
						</>
					)}
				</AnimatePresence>,
				document.body
		  );
});
