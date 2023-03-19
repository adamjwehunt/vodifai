import {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
	KeyboardEvent,
	FocusEvent,
} from 'react';
import {
	useTranscriptState,
	useTranscriptStateDispatch,
} from '../TranscriptProvider/transcriptContext';
import {
	createSearchTranscriptWords,
	getCaptionsWithSelectedItem,
} from './util';
import { useCombobox } from 'downshift';
import classNames from 'classnames';
import XIcon from '@/public/x-icon.svg';
import ChevronDownIcon from '@/public/chevron-back-icon.svg';
import styles from './transcript.module.scss';

interface SearchTranscriptInputProps {
	onEscapeKeyDown: () => void;
}

export interface SearchTranscriptInputRef {
	reset: () => void;
}

export const SearchTranscriptInput = forwardRef(function SearchTranscriptInput(
	{ onEscapeKeyDown }: SearchTranscriptInputProps,
	ref
) {
	const transcriptStateDispatch = useTranscriptStateDispatch();
	const { captions } = useTranscriptState();
	const words = createSearchTranscriptWords(captions);
	const [items, setItems] = useState(words);
	const [selectedItem, setSelectedItem] = useState<string | null | undefined>(
		null
	);
	const [centeredCaptionIndex, setCenteredCaptionIndex] = useState(0);
	const captionsWithSelectedItem = getCaptionsWithSelectedItem(
		captions,
		selectedItem
	);
	const inputRef = useRef<HTMLInputElement>(null);

	const {
		inputValue,
		highlightedIndex,
		isOpen,
		reset,
		getMenuProps,
		getInputProps,
		getItemProps,
		setInputValue,
		setHighlightedIndex,
	} = useCombobox({
		items,
		selectedItem,
		defaultHighlightedIndex: 0,
		onInputValueChange: ({ inputValue }) => {
			if (selectedItem && !inputValue) {
				setSelectedItem('');
			}

			if (inputValue) {
				setItems(
					words.filter((word) => word.startsWith(inputValue.toLowerCase()))
				);
			}
		},
		onSelectedItemChange: ({ selectedItem }) => {
			setSelectedItem(selectedItem);

			transcriptStateDispatch({
				type: 'highlightTranscriptWord',
				word: selectedItem ?? '',
			});

			if (selectedItem) {
				const zeroIndex = 0;
				setCenteredCaptionIndex(zeroIndex);
				const captionsWithSelectedItem = getCaptionsWithSelectedItem(
					captions,
					selectedItem
				);
				centerSelectedItem(captionsWithSelectedItem[zeroIndex]?.id);
			}
		},
	});

	const handleCenterPreviousSelectedItem = () => {
		const index =
			centeredCaptionIndex === 0
				? captionsWithSelectedItem.length - 1
				: centeredCaptionIndex - 1;

		centerSelectedItem(captionsWithSelectedItem[index]?.id);
		setCenteredCaptionIndex(index);
	};

	const handleCenterNextSelectedItem = () => {
		const index =
			centeredCaptionIndex === captionsWithSelectedItem.length - 1
				? 0
				: centeredCaptionIndex + 1;

		centerSelectedItem(captionsWithSelectedItem[index]?.id);
		setCenteredCaptionIndex(index);
	};

	function centerSelectedItem(captionId: number | undefined) {
		if (captionId === undefined) {
			return;
		}

		transcriptStateDispatch({
			type: 'centerCaption',
			captionId,
		});
	}

	const resetInput = useCallback(() => {
		setInputValue('');
		setSelectedItem('');
		setCenteredCaptionIndex(0);

		transcriptStateDispatch({
			type: 'highlightTranscriptWord',
			word: '',
		});

		transcriptStateDispatch({
			type: 'centerCaption',
			captionId: null,
		});

		reset();
	}, [reset, setInputValue, transcriptStateDispatch]);

	useEffect(() => resetInput(), [resetInput]);

	useImperativeHandle(ref, () => ({
		reset: () => resetInput(),
	}));

	const handleClearInput = () => {
		resetInput();
		inputRef.current?.focus();
	};

	const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
		if (selectedItem) {
			event.preventDefault();
		} else {
			resetInput();
		}
	};

	const handleOnKeyDown = ({
		key,
		shiftKey,
	}: KeyboardEvent<HTMLInputElement>) => {
		if (key === 'Escape') {
			resetInput();
			onEscapeKeyDown();
		}

		if ((key === 'Tab' || key === 'Enter') && !inputValue) {
			setHighlightedIndex(-1);
		}

		if (key === 'Enter' && selectedItem) {
			shiftKey
				? handleCenterPreviousSelectedItem()
				: handleCenterNextSelectedItem();
		}
	};

	const isMenuOpen = isOpen && items.length && inputValue.length >= 1;

	return (
		<div
			className={classNames(
				styles.searchTranscriptWrapper,
				isMenuOpen && styles.expanded
			)}
		>
			<div className={styles.searchTranscriptInputContainer}>
				<input
					aria-label="Search transcript"
					{...getInputProps({
						className: styles.searchTranscriptInput,
						value: inputValue,
						autoFocus: true,
						ref: inputRef,
						onBlur: handleBlur,
						onKeyDown: handleOnKeyDown,
					})}
				/>
				{!isMenuOpen ? null : (
					<input
						className={styles.searchTranscriptAutoComplete}
						value={items[highlightedIndex]}
						readOnly
						aria-hidden
						tabIndex={-1}
					/>
				)}
				<div className={styles.inputButtonsContainer}>
					{!selectedItem ? null : (
						<>
							<span className={styles.selectedItemOccurrences}>
								{`${centeredCaptionIndex + 1}/${
									captionsWithSelectedItem.length
								}`}
							</span>
							<button
								className={styles.highlightSelectedItemButton}
								onClick={handleCenterPreviousSelectedItem}
							>
								<ChevronDownIcon
									className={styles.searchTranscriptSelector}
									style={{ transform: 'rotate(90deg)' }}
								/>
							</button>
							<button
								className={styles.highlightSelectedItemButton}
								onClick={handleCenterNextSelectedItem}
							>
								<ChevronDownIcon
									className={styles.searchTranscriptSelector}
									style={{ transform: 'rotate(-90deg)' }}
								/>
							</button>
						</>
					)}
					{!inputValue.length ? null : (
						<button
							className={styles.clearSearchTranscriptButton}
							aria-label="Clear search"
							onClick={handleClearInput}
						>
							<XIcon />
						</button>
					)}
				</div>
			</div>
			<ul
				className={styles.searchTranscriptMenu}
				style={!isMenuOpen ? { display: 'none' } : {}}
				{...getMenuProps()}
			>
				{items.map((item, index) => (
					<li
						key={`${item}${index}`}
						className={styles.searchTranscriptMenuItem}
						style={{
							backgroundColor:
								highlightedIndex === index ? 'hsla(0, 0%, 0%, 0.3)' : null,
						}}
						{...getItemProps({
							item,
							index,
						})}
					>
						{item}
					</li>
				))}
			</ul>
		</div>
	);
});
