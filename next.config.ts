import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/metricmend",
        destination: "/insightmend",
        permanent: true,
      },
      {
        source: "/products/insightmend",
        destination: "/insightmend",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
