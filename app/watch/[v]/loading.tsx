import { SearchBar } from 'app/SearchBar';
import LoadingSpinner from '@/public/loading-spinner.svg';
import styles from './watch.module.scss';

export default function Loading() {
	return (
		<div className={styles.watchView}>
			<SearchBar button />
			<div className={styles.loadingSpinnerWrapper}>
				<LoadingSpinner />
			</div>
		</div>
	);
}
