import { SearchBar } from 'app/SearchBar';
import { getCategoryName } from 'utils/youtubeApi';
import { BrowseResults } from './BrowseResults';

interface SearchProps {
	params: { videoCategoryId: string };
}

export default async function Search({
	params: { videoCategoryId },
}: SearchProps) {
	const categoryName = await getCategoryName(videoCategoryId);

	return (
		<>
			<SearchBar button />
			{/* @ts-expect-error Server Component */}
			<BrowseResults
				videoCategoryId={videoCategoryId}
				categoryName={categoryName}
			/>
		</>
	);
}
