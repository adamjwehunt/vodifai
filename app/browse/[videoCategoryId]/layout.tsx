import { SearchBar } from 'app/components/SearchBar';

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
