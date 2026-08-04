import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.109.42"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vxmfcadkaawjmfztobcw.supabase.co",
        pathname: "/storage/v1/object/public/product-images/**",
      },
    ],
  },
};

export default nextConfig;