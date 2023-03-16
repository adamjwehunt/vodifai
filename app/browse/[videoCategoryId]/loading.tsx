import { SearchBar } from 'app/SearchBar';
import LoadingSpinner from '@/public/loading-spinner.svg';
import styles from 'app/page.module.scss';

export default function Loading() {
	return (
		<>
			<SearchBar button />
			<div className={styles.loadingSpinnerWrapper}>
				<LoadingSpinner />
			</div>
		</>
	);
}
