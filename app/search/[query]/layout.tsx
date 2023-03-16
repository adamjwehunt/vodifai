import { SearchBar } from 'app/SearchBar';

export default function SearchLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: {
		query: string;
	};
}) {
	const decodedQuery = decodeURIComponent(params.query);

	return (
		<>
			<SearchBar query={decodedQuery} />
			{children}
		</>
	);
}
