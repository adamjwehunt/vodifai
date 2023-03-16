import { SearchBar } from 'app/SearchBar';
import styles from './watch.module.scss';

interface WatchLayoutProps {
	children: React.ReactNode;
}

export default function WatchLayout({ children }: WatchLayoutProps) {
	return (
		<div className={styles.watchView}>
			<SearchBar button />
			{children}
		</div>
	);
}
