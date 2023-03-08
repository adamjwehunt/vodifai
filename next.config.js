/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		appDir: true,
	},
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/i,
			issuer: /\.[jt]sx?$/,
			use: ['@svgr/webpack'],
		});

		return config;
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
