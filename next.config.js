/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true, // ⬅️ DESATIVA ERROS DE TYPESCRIPT NO BUILD
  },
};

module.exports = nextConfig;
