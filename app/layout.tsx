import { Cabin } from "next/font/google";
import './globals.css';

const cabin = Cabin({
	weight: ['400', '700'],
	subsets: ['latin'],
});

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={cabin.className}>
			{/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
			<head />
			<body>{children}</body>
		</html>
	);
}
