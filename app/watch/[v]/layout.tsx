import { SearchBar } from 'components/SearchBar';
import styles from './watch.module.scss';

interface WatchLayoutProps {
	children: React.ReactNode;
}

export default function WatchLayout({ children }: WatchLayoutProps) {
	return (
		<>
			<SearchBar button />
			<div className={styles.watchView}>{children}</div>
		</>
	);
}
