'use client';

import { ReactElement, useState } from 'react';
import { copyTextToClipboard } from './util';
import { createPortal } from 'react-dom';
import { Toast } from './Toast';

interface ClipboardButtonProps {
	ariaLabel: string;
	children: ReactElement;
	text: string;
	toast: string;
}

export const ClipboardButton = ({
	ariaLabel,
	children,
	text,
	toast,
}: ClipboardButtonProps) => {
	const [showToast, setShowToast] = useState(false);

	const handleClipboardButtonClick = () => {
		copyTextToClipboard(text)
			.then(() => {
				setShowToast(true);
			})
			.catch((err) => {
				console.warn(err);
			});
	};

	const handleToastClose = () => {
		setShowToast(false);
	};

	return (
		<>
			<button aria-label={ariaLabel} onClick={handleClipboardButtonClick}>
				{children}
			</button>
			{!showToast || !document
				? null
				: createPortal(
						<Toast message={toast} onClose={handleToastClose} />,
						document.body
				  )}
		</>
	);
};
