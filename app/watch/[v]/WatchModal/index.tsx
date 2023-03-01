import { AnimatePresence, motion } from 'framer-motion';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import XIcon from '@/public/x-icon.svg';
import styles from './watchModal.module.scss';

interface WatchModalProps {
	children: React.ReactNode;
	isLoading?: boolean;
	loadingSpinner?: React.ReactNode;
}

export interface WatchModalRef {
	open: () => void;
}

export const WatchModal = forwardRef(function WatchModal(
	{ children, isLoading, loadingSpinner }: WatchModalProps,
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
		}

		if (isModalOpen) {
			// add aria-hidden to all focusable elements
			const focusableElements = findFocusableElements(document.body);
			applyAriaHidden(focusableElements, 'true');
			applyTabindex(focusableElements, '-1');

			// set aria-hidden for body and main content
			document.body.setAttribute('aria-hidden', 'true');
			document.body.classList.add('modal-open');
		} else {
			handleModalClose();
		}

		return () => handleModalClose();
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
							<button
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

function findFocusableElements(rootElement: HTMLElement) {
	return rootElement.querySelectorAll<HTMLElement>(
		'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
	);
}

function applyAriaHidden(elements: NodeListOf<HTMLElement>, value: string) {
	elements.forEach((el) => {
		el.setAttribute('aria-hidden', value);
		el.setAttribute('tabindex', '-1');
	});
}

function applyTabindex(elements: NodeListOf<HTMLElement>, value: string) {
	elements.forEach((el) => {
		el.setAttribute('tabindex', value);
	});
}
