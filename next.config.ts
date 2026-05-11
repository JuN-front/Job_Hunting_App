import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercelデプロイに必要な設定
  experimental: {
    // Server Actions は Next.js 14 では stable なので不要だが念のため
  },
  // 外部パッケージをサーバーサイドでのみバンドル（bcryptjs対応）
  serverExternalPackages: ["bcryptjs"],
};

export default nextConfig;
