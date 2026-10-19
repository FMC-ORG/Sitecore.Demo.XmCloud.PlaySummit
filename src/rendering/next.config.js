const path = require('path');
const remotePatterns = require('./src/lib/image-remote-patterns.json');
// CSDK 2.4.1's export points at a missing directory; use its shipped public root shim.
const componentPropsLoader = path.resolve(
  path.dirname(require.resolve('@sitecore-content-sdk/nextjs')),
  '../..',
  'component-props-loader.js'
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXTJS_DIST_DIR || '.next',
  reactStrictMode: true,
  poweredByHeader: false,
  i18n: {
    locales: ['en', 'fr-CA', 'ja-JP'],
    defaultLocale: process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en',
    localeDetection: false,
  },
  images: {
    remotePatterns,
  },
  async rewrites() {
    const host = process.env.NEXT_PUBLIC_SITECORE_API_HOST || process.env.SITECORE_API_HOST;
    return [
      ...(host
        ? [
            { source: '/sitecore/api/:path*', destination: `${host}/sitecore/api/:path*` },
            { source: '/-/:path*', destination: `${host}/-/:path*` },
            { source: '/sitecore/service/:path*', destination: `${host}/sitecore/service/:path*` },
          ]
        : []),
      { source: '/healthz', destination: '/api/healthz' },
      { source: '/robots.txt', destination: '/api/robots' },
      { source: '/sitemap:id([\\w-]{0,}).xml', destination: '/api/sitemap' },
      { source: '/feaas-render', destination: '/api/editing/feaas/render' },
    ];
  },
  webpack(config, options) {
    if (!options.isServer) {
      config.module.rules.unshift({
        test: /src[/\\]components[/\\].*\.tsx$/,
        use: [componentPropsLoader],
      });
    } else {
      config.externals = [
        {
          '@sitecore-feaas/clientside/react': 'commonjs @sitecore-feaas/clientside/react',
          '@sitecore/byoc': 'commonjs @sitecore/byoc',
          '@sitecore/byoc/react': 'commonjs @sitecore/byoc/react',
        },
        ...config.externals,
      ];
    }
    return config;
  },
};

module.exports =
  process.env.ANALYZE === 'true'
    ? require('@next/bundle-analyzer')({ enabled: true })(nextConfig)
    : nextConfig;
