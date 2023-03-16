import LoadingSpinner from '@/public/loading-spinner.svg';
import styles from './watch.module.scss';

export default function WatchLoading() {
	return (
		<div className={styles.loadingSpinnerWrapper}>
			<LoadingSpinner />
		</div>
	);
}
