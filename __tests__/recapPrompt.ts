import { Caption, Chapter, ChapterWithCaptions } from '@/app/types';
import {
	removeUrls,
	removeEmails,
	removePhoneNumbers,
	removeCryptoAddresses,
	removeBracketedText,
	removePunctuation,
	removeNewLines,
	removeExtraSpaces,
	removeDuplicateWords,
	removePhrasesAndWords,
	groupCaptionsByChapter,
} from '@/lib/recapPrompt';

// Stemmer is having issues with Jest, so we mock it
jest.mock('stemmer', () => ({
	stemmer: jest.fn().mockReturnValue('mocked result'),
}));

describe('groupCaptionsByChapter', () => {
	it('groups captions by chapter', () => {
		const captions: Caption[] = [
			{ id: 1, start: 1000, duration: 1000, text: 'Caption 1' },
			{ id: 2, start: 2000, duration: 1000, text: 'Caption 2' },
			{ id: 3, start: 3000, duration: 1000, text: 'Caption 3' },
			{ id: 4, start: 4000, duration: 1000, text: 'Caption 4' },
			{ id: 5, start: 5000, duration: 1000, text: 'Caption 5' },
			{ id: 6, start: 6000, duration: 1000, text: 'Caption 6' },
			{ id: 7, start: 7000, duration: 1000, text: 'Caption 7' },
			{ id: 8, start: 8000, duration: 1000, text: 'Caption 8' },
			{ id: 9, start: 9000, duration: 1000, text: 'Caption 9' },
		];

		const chapters: Chapter[] = [
			{ title: 'Chapter 1', start_time: 1000 },
			{ title: 'Chapter 2', start_time: 4000 },
			{ title: 'Chapter 3', start_time: 8000 },
		];

		const expected: ChapterWithCaptions[] = [
			{
				title: 'Chapter 1',
				start_time: 1000,
				captions: [captions[0], captions[1], captions[2]],
			},
			{
				title: 'Chapter 2',
				start_time: 4000,
				captions: [captions[3], captions[4], captions[5], captions[6]],
			},
			{
				title: 'Chapter 3',
				start_time: 8000,
				captions: [captions[7], captions[8]],
			},
		];

		expect(groupCaptionsByChapter(captions, chapters)).toEqual(expected);
	});
});

describe('Reduces text in transcript', () => {
	it('removes URLs from text', () => {
		const text = 'Here is a link: https://www.example.com';
		const expected = 'Here is a link: ';
		const result = removeUrls(text);
		expect(result).toEqual(expected);
	});

	it('removes emails from text', () => {
		const text = 'My email is john@example.com';
		const expected = 'My email is ';
		const result = removeEmails(text);
		expect(result).toEqual(expected);
	});

	it('removes phone numbers from text', () => {
		const text = 'My phone number is 123-456-7890';
		const expected = 'My phone number is ';
		const result = removePhoneNumbers(text);
		expect(result).toEqual(expected);
	});

	it('removes Ethereum addresses', () => {
		const text =
			'Hello, my Ethereum address is 0x1234567890123456789012345678901234567890.';
		expect(removeCryptoAddresses(text)).toBe('Hello, my Ethereum address is .');
	});

	it('removes Bitcoin addresses', () => {
		const text =
			'Hello, my Bitcoin address is 1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2.';
		expect(removeCryptoAddresses(text)).toBe('Hello, my Bitcoin address is .');
	});

	it('removes other crypto addresses', () => {
		const text =
			'Hello, my crypto address is 1234567890123456789012345678901234567890.';
		expect(removeCryptoAddresses(text)).toBe('Hello, my crypto address is .');
	});

	it('removes bracketed text from text', () => {
		const text = 'This is some [bracketed] text';
		const expected = 'This is some text';
		const result = removeBracketedText(text);
		expect(result).toEqual(expected);
	});

	it('removes punctuation from text', () => {
		const text = 'This is some text! With punctuation?';
		const expected = 'This is some text With punctuation';
		const result = removePunctuation(text);
		expect(result).toEqual(expected);
	});

	it('removes new lines from text', () => {
		const text = 'This is some text\nWith a new line.';
		const expected = 'This is some text With a new line.';
		const result = removeNewLines(text);
		expect(result).toEqual(expected);
	});

	it('removes extra spaces from text', () => {
		const text = 'This  is  some  text  with  extra  spaces.';
		const expected = 'This is some text with extra spaces.';
		const result = removeExtraSpaces(text);
		expect(result).toEqual(expected);
	});

	it('removes single words and phrases from text', () => {
		const input = 'The fox dog. The fox dog.';
		const wordsAndPhrases = ['jumps over the', 'quick', 'brown', 'lazy'];
		const expectedOutput = 'The fox dog. The fox dog.';

		expect(removePhrasesAndWords(input, wordsAndPhrases)).toEqual(
			expectedOutput
		);
	});

	it('removes duplicate words from text', () => {
		const input = 'dog cat fox dog';
		const expectedOutput = 'dog cat fox';
		expect(removeDuplicateWords(input)).toEqual(expectedOutput);
	});
});
