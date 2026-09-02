import type { NextConfig } from "next";

// ==========================================
// 🛠️ OFFLINE MODUS EIN-/AUSSCHALTEN
// ==========================================
// true  = Website ist offline, alle Besucher werden auf /offline umgeleitet.
// false = Website ist online (Normalbetrieb).
const OFFLINE_MODE = false;

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
    if (OFFLINE_MODE) {
      return [
        {
          source: "/:lang(de|en)/eigentuemer",
          destination: "/offline",
          permanent: false
        },
        {
          source: '/eigentuemer',
          destination: '/offline',
          permanent: false,
        },
      ];
    }

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
    ];
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
