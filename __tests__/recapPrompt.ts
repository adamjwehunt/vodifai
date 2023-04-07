import { Caption, Chapter, ChapterWithCaptions } from '@/app/types';
import {
	codifyTranscript,
	getWordFrequency,
	filterShortWords,
	sortWordsByWeight,
	generateWordMap,
	groupCaptionsByChapter,
	removeUrls,
	removeEmails,
	removePhoneNumbers,
	removeCryptoAddresses,
	removeBracketedText,
	removePunctuation,
	removeNewLines,
	removeExtraSpaces,
	removePhrasesAndWords,
	removeDuplicateWords,
	removeCenterWord,
} from '@/lib/recapPrompt';

// Stemmer is having issues with Jest, so we mock it
jest.mock('stemmer', () => ({
	stemmer: jest.fn().mockReturnValue('mocked result'),
}));

describe('removeCenterWord', () => {
	it('removes center word from a chapter and removes corresponding key-value pair from key', () => {
		const index = 0;
		const chapters = ['the quick a fox jumps', 'over the dog'];
		const key = 'a=brown';

		const result = removeCenterWord({ chapters, key }, index);

		expect(result.chapters).toEqual(['the quick fox jumps', 'over the dog']);
		expect(result.key).toEqual('');
	});

	it('does not remove key-value pair from key if center word is still used in other chapters', () => {
		const index = 0;
		const chapters = ['the quick a fox jumps', 'over the dog a'];
		const key = 'a=brown';

		const result = removeCenterWord({ chapters, key }, index);

		expect(result.chapters).toEqual(['the quick fox jumps', 'over the dog a']);
		expect(result.key).toEqual('a=brown');
	});

	it('does not remove key-value pair from key if key exists in same chapter after center word is removed', () => {
		const index = 0;
		const chapters = ['the quick a fox a', 'over the dog'];
		const key = 'a=brown';

		const result = removeCenterWord({ chapters, key }, index);

		expect(result.chapters).toEqual(['the quick fox a', 'over the dog']);
		expect(result.key).toEqual('a=brown');
	});
});

describe('codifyTranscript', () => {
	it('codifyTranscript should codify text and generate a key', () => {
		const chapters = [
			'deep look series shot ultra high definition that all very small very beautiful often very creepy new episodes twice month kqed pbs digital studios check out',
		];
		const { chapters: codifiedChapters, key } = codifyTranscript(chapters);

		expect(codifiedChapters).toEqual([
			'deep look series shot ultra high definition that all a small a beautiful often a creepy new episodes twice month kqed pbs digital studios check out',
		]);
		expect(key).toEqual('a=very');
	});

	it("codifyTranscript should codify duplicate words if the word weight (frequency * length) is less than it's key", () => {
		const chapters = [
			'the quick brown fox jumped over the lazy dog and baby fox',
		];
		const { chapters: codifiedChapters, key } = codifyTranscript(chapters);

		expect(codifiedChapters).toEqual([
			'the quick brown fox jumped over the lazy dog and baby fox',
		]);
		expect(key).toEqual('');
	});

	it('should return word frequency object for string with multiple words', () => {
		const text = 'the quick brown fox jumped over the lazy dog and baby fox';
		const wordFrequency = getWordFrequency(text);

		expect(wordFrequency).toEqual({
			the: 2,
			quick: 1,
			brown: 1,
			fox: 2,
			jumped: 1,
			over: 1,
			lazy: 1,
			dog: 1,
			and: 1,
			baby: 1,
		});
	});

	it('should filter short words with frequency less than or equal to 1', () => {
		const wordFrequency = {
			apple: 2,
			pear: 1,
			banana: 3,
			kiwi: 1,
		};
		const expectedOutput = {
			apple: 2,
			banana: 3,
		};
		expect(filterShortWords(wordFrequency)).toEqual(expectedOutput);
	});

	it('should not filter words with frequency greater than 1 and sufficient weight', () => {
		const wordFrequency = {
			hello: 2,
			world: 1,
			goodbye: 3,
			moon: 1,
		};
		const expectedOutput = {
			hello: 2,
			goodbye: 3,
		};
		expect(filterShortWords(wordFrequency)).toEqual(expectedOutput);
	});

	it('should filter all words when all words are short and/or have low frequency', () => {
		const wordFrequency = {
			a: 1,
			the: 2,
			is: 1,
			of: 1,
		};
		const expectedOutput = {};
		expect(filterShortWords(wordFrequency)).toEqual(expectedOutput);
	});

	it('should sort words by weight (frequency * length)', () => {
		const wordFrequency = {
			apple: 3,
			banana: 2,
			cherry: 4,
			date: 1,
		};
		const sortedWords = sortWordsByWeight(wordFrequency);

		expect(sortedWords).toEqual(['cherry', 'apple', 'banana', 'date']);
	});

	it('should handle empty input', () => {
		const wordFrequency = {};
		const sortedWords = sortWordsByWeight(wordFrequency);

		expect(sortedWords).toEqual([]);
	});

	it('should generate a valid word map and key', () => {
		const sortedWords = ['apple', 'banana', 'cherry', 'date'];
		const replacementChars = 'abcd';
		const { wordMap, key } = generateWordMap(sortedWords, replacementChars);

		expect(wordMap).toEqual({
			apple: 'a',
			banana: 'b',
			cherry: 'c',
			date: 'd',
		});

		expect(key).toBe('a=apple b=banana c=cherry d=date');
	});
});

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
