import type { NextConfig } from "next";

const INSIGHTMEND_URL = "https://insightmend.com";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The InsightMend product experience (app, auth, admin) now lives on
      // its own domain/deployment. These keep old bookmarks and inbound
      // links from 404ing after the split.
      { source: "/metricmend", destination: INSIGHTMEND_URL, permanent: true },
      { source: "/insightmend", destination: INSIGHTMEND_URL, permanent: true },
      { source: "/app", destination: INSIGHTMEND_URL, permanent: true },
      { source: "/app/:path*", destination: `${INSIGHTMEND_URL}/app/:path*`, permanent: true },
      { source: "/login", destination: `${INSIGHTMEND_URL}/login`, permanent: true },
      { source: "/signup", destination: `${INSIGHTMEND_URL}/signup`, permanent: true },
      { source: "/onboarding", destination: `${INSIGHTMEND_URL}/onboarding`, permanent: true },
      { source: "/founder/login", destination: `${INSIGHTMEND_URL}/founder/login`, permanent: true },
      { source: "/internal/metricmend", destination: `${INSIGHTMEND_URL}/internal/metricmend`, permanent: true },
      { source: "/internal/metricmend/:path*", destination: `${INSIGHTMEND_URL}/internal/metricmend/:path*`, permanent: true },
    ];
  },
};

export default nextConfig;
