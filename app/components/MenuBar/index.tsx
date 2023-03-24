'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import HomeIcon from '@/public/home-icon.svg';
import HomeIconActive from '@/public/home-icon-active.svg';
import SearchIcon from '@/public/search-icon-2.svg';
import SearchIconActive from '@/public/search-icon-2-active.svg';
import { AboutButton } from '../AboutButton';
import classNames from 'classnames';
import styles from './menuBar.module.scss';

export const MenuBar = () => {
	const pathname = usePathname();

	return pathname.includes('/watch') ? null : (
		<div className={styles.menuBar}>
			<Link href="/" className={styles.menuBarItem}>
				<button
					className={classNames(
						styles.menuBarItem,
						pathname !== '/' ? null : styles.active
					)}
				>
					{pathname !== '/' ? <HomeIcon /> : <HomeIconActive />}
					{'Home'}
				</button>
			</Link>
			<Link href="/search" className={styles.menuBarItem}>
				<button
					className={classNames(
						styles.menuBarItem,
						!(pathname.includes('/search') || pathname.includes('/browse'))
							? null
							: styles.active
					)}
				>
					{!(pathname.includes('/search') || pathname.includes('/browse')) ? (
						<SearchIcon />
					) : (
						<SearchIconActive />
					)}
					{'Search'}
				</button>
			</Link>
			<AboutButton buttonClassName={styles.menuBarItem} label />
		</div>
	);
};
