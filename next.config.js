/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  sassOptions: {
    includePaths: ['./src/styles'],
  },
  env: {
    NEXT_PUBLIC_WP_API_URL: process.env.NEXT_PUBLIC_WP_API_URL,
    NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    GRAVITY_FORMS_API_URL: process.env.GRAVITY_FORMS_API_URL || 'https://signlab.com.au/staging/wp-json',
    GRAVITY_FORMS_CONSUMER_KEY: process.env.GRAVITY_FORMS_CONSUMER_KEY,
    GRAVITY_FORMS_CONSUMER_SECRET: process.env.GRAVITY_FORMS_CONSUMER_SECRET,
  },
  images: {
    domains: ['job.beplusprojects.com', 'signlab.com.au', 'localhost', 'img.youtube.com'],
  },
  // ISR Configuration
  revalidate: 60, // Revalidate every 60 seconds
}

module.exports = nextConfig
