/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	distDir: process.env.NODE_ENV === 'production' ? '.next-prod' : '.next'
};
module.exports = nextConfig;
