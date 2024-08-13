/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
  reactStrictMode: false,
  images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'res.cloudinary.com',
      port: '',
      pathname: '/dsymmax8h/image/upload/**',
    },
  ],
},
  webpack: config => {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src')
    return config
  }
}


module.exports = nextConfig
