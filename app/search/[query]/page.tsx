import { SearchBar } from 'app/SearchBar';
import { SearchResults } from './SearchResults';

interface SearchProps {
	params: { query: string };
}

export default function Search({ params: { query } }: SearchProps) {
	const decodedQuery = decodeURIComponent(query);

	return (
		<>
			<SearchBar query={decodedQuery} />
			{/* @ts-expect-error Server Component */}
			<SearchResults query={decodedQuery} />
		</>
	);
}
