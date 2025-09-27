# SignLab Frontend

A modern Next.js application built for WordPress headless CMS integration with ACF flexible fields, ISR (Incremental Static Regeneration), and dynamic content management.

## 🚀 Features

- **Next.js 14** with App Router
- **JavaScript** for development
- **Tailwind CSS** for styling
- **Sass/SCSS** support for advanced styling
- **WordPress REST API** integration
- **ACF (Advanced Custom Fields)** flexible content support
- **Responsive design** with mobile-first approach
- **SEO optimized** with metadata generation
- **Modular component architecture** for flexible content sections

## 📋 Prerequisites

- Node.js 18.17.0 or higher
- npm or yarn package manager
- WordPress site with REST API enabled
- ACF (Advanced Custom Fields) plugin installed

## 🛠️ Installation

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
NEXT_PUBLIC_WP_ACF_API_URL=https://your-wordpress-site.com/wp-json/acf/v3
NEXT_PUBLIC_SITE_NAME=SignLab
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

4. **Update the WordPress API URLs** in your environment variables to match your WordPress site.

## 🚀 Development

Start the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Building for Production

```bash
npm run build
npm run start
# or
yarn build
yarn start
```