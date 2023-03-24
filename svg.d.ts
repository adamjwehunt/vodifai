declare module '*.svg?url' {
	import { StaticImport } from 'next/image';

	const defaultExport: StaticImport | string;
	export default defaultExport;
}
