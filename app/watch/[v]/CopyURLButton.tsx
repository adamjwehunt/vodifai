'use client';

import { useEffect, useState } from 'react';
import { ClipboardButton } from './ClipboardButton';

interface CopyURLButtonProps {
	toast: string;
	ariaLabel: string;
	icon: React.ReactNode;
}

export const CopyURLButton = (props: CopyURLButtonProps) => {
	const [url, setUrl] = useState<string>('');

	useEffect(() => {
		const url = window?.location.href;
		setUrl(url);
	}, []);

	return <ClipboardButton {...props} text={url} />;
};
