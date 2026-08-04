import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.100.185.100"],
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