import { Open_Sans } from 'next/font/google';
import { MenuBar } from '@/components/MenuBar';
import { Analytics } from '@vercel/analytics/react';
import './globals.scss';

const openSans = Open_Sans({
	subsets: ['latin'],
	variable: '--open-sans-font',
});

interface RootLayoutProps {
	children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<html lang="en">
			{/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
			<head />
			<body className={openSans.className}>
				{children}
				<MenuBar />
				<Analytics />
			</body>
		</html>
	);
}
