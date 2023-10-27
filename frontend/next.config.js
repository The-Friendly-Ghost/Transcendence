/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = nextConfig;

// next.config.js
module.exports = {
  // ... rest of the configuration.
  experimental: { serverActions: true },
  output: "standalone",
  env: {
    BACKEND_URL: `http://${process.env.BACKEND_HOST}:${process.env.BACKEND_PORT}`,
  },
};
