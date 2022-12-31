const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  env: {
    API_HOST: process.env.API_HOST,
  },
  rewrites() {
    return [
      {
        source: '/backend/:path*',
        destination: `${process.env.API_HOST}/${process.env.API_VERSION}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
