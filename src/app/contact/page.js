import React from 'react';
import Script from 'next/script';
import { getPageBySlug } from '../../lib/api';
import { processFlexibleContent } from '../../lib/utils';
import FlexibleContent from '../../components/FlexibleContent';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// ISR: This page will be statically generated and revalidated every 60 seconds
export const revalidate = 60;

async function getContactPageData() {
  try {
    const { data: pages, error } = await getPageBySlug('contact');
    
    if (error || !pages || pages.length === 0) {
      console.error('Error fetching contact page:', error);
      return null;
    }

    const page = pages[0];
    
    // Process the ACF data to handle media IDs
    const processedAcf = await processFlexibleContent(page.acf || {});
    
    return {
      id: page.id,
      title: page.title.rendered,
      content: page.content.rendered,
      slug: page.slug,
      acf: processedAcf,
      yoast: page.yoast_head_json || null,
      theme_options: page.theme_options || null,
    };
  } catch (error) {
    console.error('Error in getContactPageData:', error);
    return null;
  }
}

export default async function ContactPage() {
  const pageData = await getContactPageData();
  const themeOptions = pageData?.theme_options;

  // Fallback content if WordPress data is not available
  if (!pageData) {
    return (
      <div className="page">
        <Header headerData={null} />
        <main className="site-main min-h-screen">
          <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white section-padding">
            <div className="container">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl lg:text-6xl font-bold mb-6 fade-in">Page not found</h1>
              </div>
            </div>
          </section>
        </main>
        <Footer footerData={null} />
      </div>
    );
  }

  return (
    <div className="page">
      <Header headerData={themeOptions} />

      <main className="site-main min-h-screen">

        {pageData.acf?.flexible_content_sections && (
          <FlexibleContent blocks={pageData.acf.flexible_content_sections} />
        )}

        {!pageData.acf?.flexible_content_sections && (
          <div className="container section-padding">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl lg:text-5xl font-bold mb-8 text-center">
                {pageData.title}
              </h1>
              <div 
                className="wp-content"
                dangerouslySetInnerHTML={{ __html: pageData.content }}
              />
            </div>
          </div>
        )}

        <div className="container section-padding">
          Contact Form Here
        </div>
      </main>

      {pageData.yoast?.schema && (
        <Script
          id={`yoast-schema-contact`}
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(pageData.yoast.schema),
          }}
        />
      )}

      <Footer footerData={themeOptions} />
    </div>
  );
}

export async function generateMetadata() {
  const pageData = await getContactPageData();
  const yoast = pageData?.yoast;
  if (!yoast) return {};

  const robots = yoast.robots || {};
  return {
    title: yoast.title,
    description: yoast.description,
    alternates: yoast.canonical ? { canonical: yoast.canonical } : undefined,
    robots: {
      index: robots.index !== 'noindex',
      follow: robots.follow !== 'nofollow',
      googleBot: {
        index: robots.index !== 'noindex' ? 'index' : 'noindex',
        follow: robots.follow !== 'nofollow' ? 'follow' : 'nofollow',
        'max-snippet': robots['max-snippet'] || undefined,
        'max-image-preview': robots['max-image-preview'] || undefined,
        'max-video-preview': robots['max-video-preview'] || undefined,
      },
    },
    openGraph: {
      title: yoast.og_title || yoast.title,
      description: yoast.og_description || yoast.description,
      url: yoast.og_url || yoast.canonical,
      siteName: yoast.og_site_name,
      type: yoast.og_type || 'website',
      locale: yoast.og_locale,
    },
    twitter: {
      card: yoast.twitter_card || 'summary_large_image',
      title: yoast.og_title || yoast.title,
      description: yoast.og_description || yoast.description,
    },
  };
}
