// Next.js configuration for AgroSync
// Note: This project uses React (not Next.js), but this file may be referenced by some tools

module.exports = {
  reactStrictMode: true,
  // Standard React app configuration
  images: {
    unoptimized: true,
  },
  // Ensure compatibility with Cloudflare Pages
  output: 'export',
  trailingSlash: true,
};
