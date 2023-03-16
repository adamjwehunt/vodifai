import LoadingSpinner from '@/public/loading-spinner.svg';
import styles from 'app/page.module.scss';

export default function SearchLoading() {
	return (
		<div className={styles.loadingSpinnerWrapper}>
			<LoadingSpinner />
		</div>
	);
}
