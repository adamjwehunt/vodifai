import { SearchBar } from 'app/SearchBar';
import { BrowseResults } from './BrowseResults';

interface BrowseProps {
	params: { videoCategoryId: string };
}

export default async function Browse({
	params: { videoCategoryId },
}: BrowseProps) {
	return (
		<>
			{/* @ts-expect-error Server Component */}
			<BrowseResults videoCategoryId={videoCategoryId} />
		</>
	);
}
