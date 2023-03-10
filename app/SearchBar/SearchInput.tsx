'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import XIcon from '@/public/x-icon.svg';
import styles from './searchBar.module.css';
import { getYoutubeVideoIdFromUrl } from './util';

interface SearchInputProps {
	query?: string;
	readOnly?: boolean;
	placeholder?: string;
}

export const SearchInput = ({
	query,
	placeholder = 'What do you want to watch?',
	readOnly = false,
}: SearchInputProps) => {
	const router = useRouter();
	const [value, setValue] = useState(query);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const youtubeVideoId = getYoutubeVideoIdFromUrl(value);
		if (youtubeVideoId) {
			router.push(`/watch/${youtubeVideoId}`);
		}
	}, [value, router]);

	const handleKeyDown = async (
		event: React.KeyboardEvent<HTMLInputElement>
	) => {
		if (event.key === 'Enter') {
			router.push(
				`/search/${encodeURIComponent(
					(event.target as HTMLInputElement).value
				)}`
			);
		}
	};

	const handleClearInput = () => {
		setValue('');
		inputRef.current?.focus();
	};

	return (
		<>
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
			/>
			{!value ? null : (
				<button className={styles.clearTextButton} onClick={handleClearInput}>
					<XIcon />
				</button>
			)}
		</>
	);
};
