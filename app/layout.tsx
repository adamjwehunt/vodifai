import { Open_Sans } from 'next/font/google';
import { MenuBar } from 'components/MenuBar';
import './globals.scss';

const openSans = Open_Sans({
	subsets: ['latin'],
});

interface RootLayoutProps {
	children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<html lang="en" className={openSans.className}>
			{/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
			<head />
			<body>
				{children}
				<MenuBar />
			</body>
		</html>
	);
}
