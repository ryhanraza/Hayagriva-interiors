/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Prevent Turbopack from bundling @insforge/* packages.
  // These ESM packages must be resolved natively by Node.js at runtime —
  // Turbopack's CJS/ESM interop fails on @insforge/shared-schemas (import-only exports).
  serverExternalPackages: ['@insforge/sdk', '@insforge/shared-schemas'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '376pmed2.ap-southeast.insforge.app',
      },
    ],
  }
}

module.exports = nextConfig
