/* eslint-disable */
const path = require('path');
// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// });
/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  compress: true,
  output: 'standalone',
  reactStrictMode: false,
  staticPageGenerationTimeout: 1000,
  productionBrowserSourceMaps: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  env: {
    API_HOST: process.env.API_HOST,
    MS_PATH: process.env.MS_PATH,
    HOST_IMAGE: process.env.HOST_IMAGE,
    EXTERNAL_HOST: process.env.EXTERNAL_HOST,
    BANNER_ENABLED: process.env.BANNER_ENABLED,
    QR_PAYMENT_KEY: process.env.QR_PAYMENT_KEY,
    NEXT_PUBLIC_REGEX_PHONE: process.env.NEXT_PUBLIC_REGEX_PHONE,
    NEXT_PUBLIC_GROUP_INFO_KEYS: process.env.NEXT_PUBLIC_GROUP_INFO_KEYS,
    HOST: process.env.HOST,
  },
  images: {
    domains: [
      process.env.HOST_IMAGE,
      process.env.INTERNAL_HOST_IMAGE,
      // process.env.INTERNAL_HOST_IMAGE_STG,
    ],
  },
  async redirects() {
    return [
      {
        source: `/:path*.amp`,
        destination: `/:path*`,
        permanent: true,
      },
    ];
  },
  rewrites() {
    return [
      {
        source: '/backend-external/:path*',
        destination: `${process.env.EXTERNAL_HOST}/:path*`,
      },
      {
        source: '/backend-stg/:path*',
        destination: `${process.env.API_HOST}/:path*`,
      },
      {
        source: '/backend/:path*',
        destination: `${process.env.API_HOST}/${process.env.MS_PATH}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
