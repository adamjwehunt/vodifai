'use client';

import { ReactNode, useEffect, useState } from 'react';
import { ClipboardButton } from './ClipboardButton';

interface CopyURLButtonProps {
	toast: string;
	ariaLabel: string;
	icon: ReactNode;
}

export const CopyURLButton = (props: CopyURLButtonProps) => {
	const [url, setUrl] = useState<string>('');

	useEffect(() => {
		const url = window?.location.href;
		setUrl(url);
	}, []);

	return <ClipboardButton {...props} text={url} />;
};
