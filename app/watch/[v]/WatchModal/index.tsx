import { AnimatePresence, motion } from 'framer-motion';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { applyAriaHidden, applyTabindex, findFocusableElements } from './util';
import XIcon from '@/public/x-icon.svg';
import styles from './watchModal.module.scss';

interface WatchModalProps {
	title: string;
	children: React.ReactNode;
	isLoading?: boolean;
	loadingSpinner?: React.ReactNode;
}

export interface WatchModalRef {
	open: () => void;
}

export const WatchModal = forwardRef(function WatchModal(
	{ title, children, isLoading, loadingSpinner }: WatchModalProps,
	ref
) {
	const [isModalOpen, setIsModalOpen] = useState(false);

	useImperativeHandle(ref, () => ({
		open: () => setIsModalOpen(true),
	}));

	useEffect(() => {
		function handleModalClose() {
			// remove aria-hidden from all focusable elements
			const focusableElements = document.body.querySelectorAll<HTMLElement>(
				'[aria-hidden="true"]'
			);
			applyAriaHidden(focusableElements, 'false');
			applyTabindex(focusableElements, '0');

			// remove aria-hidden for body and main content
			document.body.removeAttribute('aria-hidden');
			document.body.classList.remove('modal-open');

			// reset tabindex of previously hidden elements
			const previouslyHiddenElements =
				document.body.querySelectorAll<HTMLElement>(
					'[data-previously-hidden="true"]'
				);
			applyTabindex(previouslyHiddenElements, '0');

			// remove event listener
			document.removeEventListener('keydown', handleKeyDown);
		}

		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === 'Escape') {
				setIsModalOpen(false);
			}
		}

		if (isModalOpen) {
			// add aria-hidden to all focusable elements
			const focusableElements = findFocusableElements(document.body);
			applyAriaHidden(focusableElements, 'true');
			applyTabindex(focusableElements, '-1');

			// set aria-hidden for body and main content
			document.body.setAttribute('aria-hidden', 'true');
			document.body.classList.add('modal-open');

			// add event listener for Esc key
			document.addEventListener('keydown', handleKeyDown);

			return () => handleModalClose();
		}
	}, [isModalOpen]);

	return (
		<AnimatePresence>
			{!isModalOpen ? null : (
				<>
					<motion.div
						className={styles.modalBackdrop}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={() => setIsModalOpen(false)}
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
								onClick={() => setIsModalOpen(false)}
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
							<button
								id={'watch-modal-close-button'}
								className={styles.closeButtonBottom}
								aria-label={'Close recap'}
								onClick={() => setIsModalOpen(false)}
							>
								{'Close'}
							</button>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
});