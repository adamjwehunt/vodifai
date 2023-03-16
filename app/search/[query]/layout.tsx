import { SearchBar } from 'app/SearchBar';

interface SearchLayoutProps {
	children: React.ReactNode;
	params: {
		query: string;
	};
}

export default function SearchLayout({ children, params }: SearchLayoutProps) {
	return (
		<>
			<SearchBar query={decodeURIComponent(params.query)} />
			{children}
		</>
	);
}
