import { SearchResults } from './SearchResults';

interface SearchProps {
	params: { query: string };
}

export default function Search({ params: { query } }: SearchProps) {
	const decodedQuery = decodeURIComponent(query);
	//@ts-expect-error Server Component
	return <SearchResults query={decodedQuery} />;
}
