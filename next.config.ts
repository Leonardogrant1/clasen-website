import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow accessing the dev server via LAN IP (e.g. from phone or other devices)
  allowedDevOrigins: ["192.168.2.149"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d3v0px0pttie1i.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  async redirects() {
    return [
      {
        source: "/:lang(de|en)/eigentuemer",
        destination: "https://clasen-immobilien.perspectivefunnel.com",
        permanent: false
      },
      {
        source: '/eigentuemer',
        destination: 'https://clasen-immobilien.perspectivefunnel.com',
        permanent: false,
      },
    ]
  },


  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://eu-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/array/:path*",
        destination: "https://eu-assets.i.posthog.com/array/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://eu.i.posthog.com/:path*",
      },
    ];
  },
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
