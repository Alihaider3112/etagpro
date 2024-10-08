/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: []
  },
  webpack: config => {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src')
    return config
  }
}


module.exports = nextConfig
