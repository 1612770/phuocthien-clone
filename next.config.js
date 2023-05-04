/* eslint-disable */
const path = require('path');
// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// });
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
    MS_PATH: process.env.MS_PATH,
    HOST_IMAGE: process.env.HOST_IMAGE,

    BANNER_ENABLED: process.env.BANNER_ENABLED,

    NEXT_PUBLIC_REGEX_PHONE: process.env.NEXT_PUBLIC_REGEX_PHONE,
    NEXT_PUBLIC_GROUP_INFO_KEYS: process.env.NEXT_PUBLIC_GROUP_INFO_KEYS,
  },
  images: {
    domains: [`${process.env.HOST_IMAGE}`, process.env.INTERNAL_HOST_IMAGE],
  },

  rewrites() {
    return [
      {
        source: '/backend/:path*',
        destination: `${process.env.API_HOST}/${process.env.MS_PATH}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
