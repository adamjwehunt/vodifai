import { SearchBar } from '@/components/SearchBar';
import { ReactNode } from 'react';

interface SearchLayoutProps {
	children: ReactNode;
	params: Promise<{
		query: string;
	}>;
}

export default async function SearchLayout({ children, params }: SearchLayoutProps) {
	const { query } = await params;
	return (
		<>
			<SearchBar query={decodeURIComponent(query)} />
			{children}
		</>
	);
}
