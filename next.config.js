/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: ['./src/styles'],
  },
  env: {
    NEXT_PUBLIC_WP_API_URL: process.env.NEXT_PUBLIC_WP_API_URL,
    NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_GRAVITY_FORMS_API_URL: process.env.NEXT_PUBLIC_GRAVITY_FORMS_API_URL || 'https://dashboard.signlab.com.au/wp-json',
    NEXT_PUBLIC_GRAVITY_FORMS_CONSUMER_KEY: process.env.NEXT_PUBLIC_GRAVITY_FORMS_CONSUMER_KEY,
    NEXT_PUBLIC_GRAVITY_FORMS_CONSUMER_SECRET: process.env.NEXT_PUBLIC_GRAVITY_FORMS_CONSUMER_SECRET,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'job.beplusprojects.com' },
      { protocol: 'https', hostname: 'signlab.com.au' },
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: 'dashboard.signlab.com.au' },
      { protocol: 'http', hostname: '43.250.142.29' },
    ],
  },
}

module.exports = nextConfig
