import { SearchBar } from 'app/SearchBar';

interface BrowseLayoutProps {
	children: React.ReactNode;
}

export default function BrowseLayout({ children }: BrowseLayoutProps) {
	return (
		<>
			<SearchBar button />
			{children}
		</>
	);
}
