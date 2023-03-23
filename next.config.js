/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		appDir: true,
	},
	webpack(config) {
		const fileLoaderRule = config.module.rules.find((rule) =>
			rule.test?.test?.('.svg')
		);

		config.module.rules.push(
			{
				...fileLoaderRule,
				test: /\.svg$/i,
				resourceQuery: /url/, // *.svg?url
			},
			// Convert all other *.svg imports to React components
			{
				test: /\.svg$/i,
				issuer: /\.[jt]sx?$/,
				resourceQuery: { not: /url/ }, // exclude if *.svg?url
				use: ['@svgr/webpack'],
			}
		);

		return config;
	},
	sassOptions: {
		includePaths: ['./app'],
		prependData: `@import "variables.scss";`,
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'i.ytimg.com',
				port: '',
				pathname: '/vi/**',
			},
			{
				protocol: 'https',
				hostname: 'yt3.ggpht.com',
				port: '',
				pathname: '/ytc/**',
			},
			{
				protocol: 'https',
				hostname: 'yt3.ggpht.com',
				port: '',
				pathname: '/**',
			},
		],
	},
};

module.exports = nextConfig;
