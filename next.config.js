/** @type {import('next').NextConfig} */
const nextConfig = {headers: () => [
    {
      source: '/numbers',
      headers: [
        {
          key: 'Cache-Control',
          value: 'no-store',
        },
      ],
    },
  ],}

module.exports = nextConfig
