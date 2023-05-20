/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { images: { layoutRaw: true } },
  images: {
    domains: ['lh3.googleusercontent.com'],
    layoutRaw: true,
    loader: 'akamai',
    path: '',
  },
};

module.exports = nextConfig;
