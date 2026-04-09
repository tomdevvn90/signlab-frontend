# SignLab Frontend

A modern Next.js application built for WordPress headless CMS integration with ACF flexible fields, Incremental Static Regeneration (ISR), and dynamic content management.

## Features

- **Next.js 14** with App Router
- **JavaScript** for development
- **Tailwind CSS** for styling
- **Sass/SCSS** support for advanced styling and fluid animations
- **WordPress REST API** integration with Application Passwords support
- **ACF (Advanced Custom Fields)** flexible content support mapping
- **Pre-built Flexible Modules** including Hero components, Swiper-based Hero Sliders, Parallax imaging, galleries (Yet Another React Lightbox), and dynamic grid navigations
- **Image Optimization** highly tuned with `next/image` ensuring responsive, fast-loading, visually-stable layouts
- **Responsive design** with a mobile-first approach
- **SEO optimized** with dynamic server-side metadata generation
- **Modular component architecture** for clean and maintainable scaling

## Prerequisites

- Node.js 18.17.0 or higher
- npm or yarn package manager
- WordPress site with REST API enabled
- ACF (Advanced Custom Fields) plugin installed
- Standard WordPress Application Passwords for authenticated API requests

## Installation

1. **Clone the repository:**

```bash
git clone <repository-url>
cd signlab-frontend
```

2. **Install dependencies:**

```bash
npm install
# or
yarn install
```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_WP_API_URL=https://your-wordpress-site.com/wp-json/wp/v2
NEXT_PUBLIC_WP_API_APPLICATION_PASSWORD=your-application-password
```

4. **Remote Image Domains Configuration**
   Ensure that the `next.config.js` is properly updated to allow your WordPress media domain via `images.remotePatterns` for `next/image` to allow optimizations.

## Development

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production

To build and run the optimized production bundle:

```bash
npm run build
npm run start
# or
yarn build
yarn start
```
