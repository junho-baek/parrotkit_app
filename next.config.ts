import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 프로덕션 최적화
  reactStrictMode: true,
  
  // 이미지 최적화 설정
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // 환경 변수 검증
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '',
  },
};

export default nextConfig;
