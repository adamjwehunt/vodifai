'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import XIcon from '@/public/x-icon.svg';
import { getYoutubeVideoIdFromUrl } from './util';
import styles from './searchBar.module.css';

interface SearchInputProps {
	icon: React.ReactNode;
	query?: string;
	readOnly?: boolean;
	placeholder?: string;
}

export interface SearchInputRef {
	search: () => void;
}

export const SearchInput = ({
	icon,
	query,
	placeholder,
	readOnly = false,
}: SearchInputProps) => {
	const router = useRouter();
	const [value, setValue] = useState(query);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			handleSearch();
		}
	};

	const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
		const pastedText = event.clipboardData.getData('text');
		const youtubeVideoId =
			getYoutubeVideoIdFromUrl(pastedText) || getYoutubeVideoIdFromUrl(value);

		if (youtubeVideoId) {
			router.push(`/watch/${youtubeVideoId}`);
		}
	};

	const handleSearch = () => {
		if (!value) {
			return;
		}

		const youtubeVideoId = getYoutubeVideoIdFromUrl(value);
		if (youtubeVideoId) {
			router.push(`/watch/${youtubeVideoId}`);
		} else {
			router.push(`/search/${encodeURIComponent(value)}`);
		}
	};

	const handleClearInput = () => {
		setValue('');
		inputRef.current?.focus();
	};

	return (
		<>
			{readOnly ? (
				<div>{icon}</div>
			) : (
				<button className={styles.searchButton} onClick={handleSearch}>
					{icon}
				</button>
			)}
			<input
				ref={inputRef}
				autoFocus={!readOnly}
				tabIndex={readOnly ? -1 : 0}
				readOnly={readOnly}
				type={'text'}
				className={styles.input}
				value={value}
				placeholder={placeholder}
				onChange={(event) => setValue(event.target.value)}
				onKeyDown={handleKeyDown}
				onPaste={handlePaste}
			/>
			{!value ? null : (
				<button className={styles.clearTextButton} onClick={handleClearInput}>
					<XIcon />
				</button>
			)}
		</>
	);
};
