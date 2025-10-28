import React from 'react';
import Link from 'next/link';
import { getThemeOptions } from '../lib/api';
import Header from '../components/Header';
import Footer from '../components/Footer';

export async function generateMetadata() {
  const title = 'Page Not Found | SignLab';
  const description = 'The page you are looking for could not be found.';
  return {
    title,
    description,
    alternates: { canonical: '/' },
    robots: {
      index: false,
      follow: true,
      googleBot: {
        index: 'noindex',
        follow: 'follow',
        'max-snippet': undefined,
        'max-image-preview': undefined,
        'max-video-preview': undefined,
      },
    },
    openGraph: {
      title,
      description,
      url: '/',
      siteName: 'SignLab',
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function NotFound() {
  
  const themeOptions = await getThemeOptions();

  return (
    <div className="page">
      <Header headerData={themeOptions} />
      
      <main className="site-main">
        <div className="flex items-center justify-center py-40 bg-primary">
          <div className="container mx-auto px-5 text-center">
            {/* 404 Number */}
            <div className="mb-8">
              <h1 className="text-[60px] md:text-[80px] lg:text-[100px] font-bold leading-none text-white">
                404
              </h1>
            </div>
            
            {/* Error Message */}
            <div className="mb-12 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
                Page Not Found
              </h2>
              <p className="text-lg md:text-xl text-white mb-2">
                Sorry, we couldn&apos;t find the page you&apos;re looking for.
              </p>
            </div>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/" 
                className="bg-white text-primary px-8 py-4 rounded-lg font-bold text-lg transition-colors duration-200 inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Go to Homepage
              </Link>
            </div>

          </div>
        </div>
      </main>

      <Footer footerData={themeOptions} pageData={null} />
    </div>
  );
}

