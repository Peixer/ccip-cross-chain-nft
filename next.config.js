/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["localhost", "nft-cdn.alchemy.com", "ipfs.io"],
  },
};

module.exports = nextConfig;
