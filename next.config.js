// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: false,
  staticPageGenerationTimeout: 1000,

  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  env: {
    API_HOST: process.env.API_HOST,
    API_VERSION: process.env.API_VERSION,
    HOST_IMAGE: process.env.HOST_IMAGE,
    NEXT_PUBLIC_REGEX_PHONE: process.env.NEXT_PUBLIC_REGEX_PHONE,
  },
  images: {
    domains: [`${process.env.HOST_IMAGE}`],
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
