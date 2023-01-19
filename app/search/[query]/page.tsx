import SearchBar from '../SearchBar';
import SearchResults from './SearchResults';

export default function Search({ params }: { params: { query: string } }) {
	const query = decodeURIComponent(params.query);
	return (
		<>
			<SearchBar query={query} />
			{/* @ts-expect-error Server Component */}
			<SearchResults query={query} />
		</>
	);
}
