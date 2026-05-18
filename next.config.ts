import type { NextConfig } from "next";

const isPagesDeployment = process.env.GITHUB_ACTIONS === 'true'

const nextConfig: NextConfig = {
  // Static export for GitHub Pages deployment
  output: isPagesDeployment ? 'export' : undefined,
  // Repo name as basePath when deployed to https://apex-teknologies.github.io/pos-frontend/
  basePath: isPagesDeployment ? '/pos-frontend' : '',
  // Image optimisation requires a server — disable for static export
  images: {
    unoptimized: true,
  },
  // Trailing slash ensures each page gets its own folder (required by GitHub Pages)
  trailingSlash: isPagesDeployment,
};

export default nextConfig;
