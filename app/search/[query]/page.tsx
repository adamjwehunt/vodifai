import SearchBar from '../SearchBar';
import SearchResults from './SearchResults';

export default function Search({ params: { query } }: any) {
	return (
		<>
			<SearchBar query={query} />
			<SearchResults query={query} />
		</>
	);
}
