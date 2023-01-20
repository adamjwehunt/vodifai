'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import XIcon from '@/public/x-icon.svg';
import styles from './search.module.css';

interface SearchInputProps {
	query?: string;
	noFocus?: boolean;
}

export const SearchInput = ({ query, noFocus }: SearchInputProps) => {
	const router = useRouter();
	const [value, setValue] = useState(query);

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
		router.push(`/search`);
	};

	return (
		<>
			<input
				autoFocus={!noFocus}
				tabIndex={noFocus ? -1 : 0}
				type={'text'}
				className={styles.input}
				value={value}
				placeholder="What do you want to watch?"
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
