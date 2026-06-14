/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack: (config) => {
		// Avoid noisy PackFile cache warnings for large third-party module strings.
		if (config.cache && config.cache.type === 'filesystem') {
			config.cache = { type: 'memory' };
		}

		return config;
	},
	images: {
		domains: ['cdn.urmichakraborty.com'],
	},
};

export default nextConfig;
