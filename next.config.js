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
  async redirects() {
    return [
      // Old calculator URLs → combined page
      { source: '/vehicle-wrap-cost-calculator', destination: '/quote-calculators', permanent: false },
      { source: '/signage-cost-estimator', destination: '/quote-calculators', permanent: false },

      // Old singular → current plural URLs
      { source: '/car-wrap', destination: '/car-wraps', permanent: true },
      { source: '/van-wrap', destination: '/van-wraps', permanent: true },
      { source: '/ute-wrap', destination: '/ute-wraps', permanent: true },
      { source: '/truck-wrap', destination: '/truck-wraps', permanent: true },
      { source: '/bus-wrap', destination: '/bus-wraps', permanent: true },
      { source: '/boat-wrap', destination: '/boat-wraps', permanent: true },
      { source: '/fleet-wrap', destination: '/fleet-wraps', permanent: true },
      { source: '/trailer-wrap', destination: '/trailer-wraps', permanent: true },
      { source: '/vehicle-wrap', destination: '/vehicle-wraps', permanent: true },
      { source: '/wall-wrap', destination: '/wall-wraps', permanent: true },

      // Old WordPress-style slugs → current pages
      { source: '/reception-signage', destination: '/reception-signs', permanent: true },
      { source: '/wayfinding-signage', destination: '/wayfinding-signs', permanent: true },
      { source: '/shopfront-signs', destination: '/shopfront-signage', permanent: true },
      { source: '/neon-signs', destination: '/neon-flex', permanent: true },
      { source: '/led-signs', destination: '/digital-signage', permanent: true },
      { source: '/digital-signs', destination: '/digital-signage', permanent: true },
      { source: '/pylon-sign', destination: '/pylon-signs', permanent: true },
      { source: '/illuminated-sign', destination: '/illuminated-signs', permanent: true },
      { source: '/a-frame', destination: '/a-frame-signs', permanent: true },
      { source: '/banner', destination: '/banners', permanent: true },

      // Common alternative paths
      { source: '/about', destination: '/about-us', permanent: true },
      { source: '/blog', destination: '/the-latest', permanent: true },
      { source: '/news', destination: '/the-latest', permanent: true },
      { source: '/contact-us', destination: '/contact', permanent: true },
      { source: '/get-a-quote', destination: '/contact', permanent: true },
      { source: '/free-quote', destination: '/contact', permanent: true },
      { source: '/quote', destination: '/contact', permanent: true },
      { source: '/signs', destination: '/signage', permanent: true },
      { source: '/sign-shop', destination: '/signage', permanent: true },

      // Old WordPress category/section patterns
      { source: '/services', destination: '/', permanent: true },
      { source: '/portfolio', destination: '/the-latest', permanent: true },
      { source: '/gallery', destination: '/the-latest', permanent: true },
      { source: '/projects', destination: '/the-latest', permanent: true },
      { source: '/reviews', destination: '/', permanent: true },
      { source: '/testimonials', destination: '/', permanent: true },

      // Service category pages people might guess
      { source: '/signage-services', destination: '/signage', permanent: true },
      { source: '/vehicle-wrap-services', destination: '/vehicle-wraps', permanent: true },
      { source: '/wayfinding', destination: '/wayfinding-signs', permanent: true },
    ]
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
