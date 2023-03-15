'use client';

import { useState } from 'react';
import { copyTextToClipboard } from './util';
import { createPortal } from 'react-dom';
import { Toast } from './Toast';

interface ClipboardButtonProps {
	ariaLabel: string;
	icon: React.ReactNode;
	text: string;
	toast: string;
}

export const ClipboardButton = ({
	ariaLabel,
	icon,
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
			<button
				style={{ padding: '0.125rem' }}
				aria-label={ariaLabel}
				onClick={handleClipboardButtonClick}
			>
				{icon}
			</button>
			{!showToast
				? null
				: createPortal(
						<Toast message={toast} onClose={handleToastClose} />,
						document.body
				  )}
		</>
	);
};
