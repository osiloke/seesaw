import type {NextConfig} from 'next';

const { execSync } = require('child_process');

let commitSha = process.env.NEXT_PUBLIC_COMMIT_SHA;

if (!commitSha) {
  try {
    commitSha = execSync('git rev-parse HEAD').toString().trim();
  } catch (e) {
    console.error('Failed to get git commit SHA', e);
    commitSha = 'unknown';
  }
}


const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_COMMIT_SHA: commitSha,
  },
};

export default nextConfig;
