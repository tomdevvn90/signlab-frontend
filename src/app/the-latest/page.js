import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import PostCard from '../../components/common/PostCard';
import Script from 'next/script';
import CallToActionSection from '../../components/FlexibleSections/CallToAction';
import Form from '../../components/FlexibleSections/Form';
import { getPageBySlug, getPosts } from '../../lib/api';

// ISR: This page will be statically generated and revalidated every 60 seconds
export const revalidate = 60;

async function getTheLatestPageData() {
  try {
    const { data: pages, error } = await getPageBySlug('the-latest');
    
    if (error || !pages || pages.length === 0) {
      console.error('Error fetching the latest page:', error);
      return null;
    }

    const page = pages[0]; 
    return {
      id: page.id,
      title: page.title.rendered,
      slug: page.slug,
      yoast: page.yoast_head_json || null,
      theme_options: page.theme_options || null,
    };
  } catch (error) {
    console.error('Error in getHomePageData:', error);
    return null;
  }
}

async function getBlogPosts() {
  try {
    const { data: posts, error } = await getPosts(7, 1);
    return posts;
  } catch (error) {
    console.error('Error in getBlogPosts:', error);
    return [];
  }
}

export default async function TheLatestPage() {
  const pageData = await getTheLatestPageData();
  const posts = await getBlogPosts();
  const themeOptions = pageData.theme_options;
  const globalFlexibleContent = themeOptions?.flexible_content_sections;
  
  // Fallback content if WordPress data is not available
  if (!pageData) {
    return (
      <div className="page">
        <Header headerData={null} />
        <div className="container section-padding">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-gradient">
              Page not found
            </h1>
          </div>
        </div>
        <Footer footerData={null} />
      </div>
    );
  }

  return (
    <div className="page">
      <Header headerData={themeOptions} />

      <main className="site-main min-h-screen">

        {/* Hero Section - Blue Background */}
        <section className="pt-36 pb-16 lg:pt-48 lg:pb-28 bg-[#0051bc]">
          <div className="container">
            <div className="text-center">
              <h1 className="text-4xl lg:text-6xl font-extrabold mb-6 text-white">
                {pageData.title}
              </h1>
              <p className="text-3xl font-bold text-white max-w-3xl mx-auto">
                See what we have been up to lately.
              </p>
            </div>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-[1540px] mx-auto px-4 lg:px-8 xl:px-16">
            {!posts || posts.length === 0 ? (
              <div className="text-center py-16">
                <h2 className="text-2xl font-semibold text-gray-600 mb-4">
                  No content found
                </h2>
                <p className="text-gray-500">
                  Check back later for new content.
                </p>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap mb-16">
                  {posts && posts.length > 0 && posts.map((post, index) => {
                    return <PostCard key={post.id} post={post} postIndex={index} />;
                  })}
                </div>

                {/* Load More Button */}
                <div className="text-center">
                  <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-12 rounded-lg transition-colors duration-200 text-lg">
                    Load More
                  </button>
                </div>
              </>
            )}
          </div>
        </section>

        {globalFlexibleContent && globalFlexibleContent.map((block, index) => {
          switch (block.acf_fc_layout) {
            case 'cta_section':
              return <CallToActionSection key={index} data={block} />;
            case 'form_section':
              return <Form key={index} data={block} />;
            default:
              console.warn(`Unknown ACF layout: ${block.acf_fc_layout}`);
              return null;
          }
        })}
      </main>

      {pageData.yoast?.schema && (
        <Script
          id={`yoast-schema-the-latest`}
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
  const pageData = await getTheLatestPageData();
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
