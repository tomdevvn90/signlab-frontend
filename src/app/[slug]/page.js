import React from 'react';
import Script from 'next/script';
import { getPageBySlug, getMedia } from '../../lib/api';
import FlexibleContent from '../../components/FlexibleContent';

// ISR: This page will be statically generated and revalidated every 60 seconds
export const revalidate = 60;

// Helper function to process flexible content and fetch media details
async function processFlexibleContent(acfData) {
  if (!acfData?.flexible_content_sections || !Array.isArray(acfData.flexible_content_sections)) {
    return acfData;
  }

  const processedSections = await Promise.all(
    acfData.flexible_content_sections.map(async (section) => {
      // If this is a hero section with a media ID, fetch the media details
      if (section.acf_fc_layout === 'hero_section' && section.hero_bg_image && typeof section.hero_bg_image === 'number') {
        try {
          const { data: media, error } = await getMedia(section.hero_bg_image);
          if (!error && media) {
            return {
              ...section,
              hero_bg_image: {
                url: media.source_url,
                alt: media.alt_text || 'Hero Image'
              }
            };
          }
        } catch (error) {
          console.error('Error fetching media for hero section:', error);
        }
      }
      
      // If this is a content with image section with a media ID, fetch the media details
      if (
        section.acf_fc_layout === 'content_img_section' &&
        section.image &&
        typeof section.image === 'number'
      ) {
        try {
          const { data: media, error } = await getMedia(section.image);
          if (!error && media) {
            return {
              ...section,
              image: {
                url: media.source_url,
                alt: media.alt_text || 'Content Image'
              }
            };
          }
        } catch (error) {
          console.error('Error fetching media for content with image section:', error);
        }
      }
      
      // If this is a parallax section with a background image media ID, fetch the media details
      if (
        section.acf_fc_layout === 'parallax_section' &&
        section.background_image &&
        typeof section.background_image === 'number'
      ) {
        try {
          const { data: media, error } = await getMedia(section.background_image);
          if (!error && media) {
            return {
              ...section,
              background_image: {
                url: media.source_url,
                alt: media.alt_text || 'Parallax Background'
              }
            };
          }
        } catch (error) {
          console.error('Error fetching media for parallax section:', error);
        }
      }
      
      return section;
    })
  );

  return {
    ...acfData,
    flexible_content_sections: processedSections
  };
}

async function getPageData(slug) {
  try {
    const { data: pages, error } = await getPageBySlug(slug);
    
    if (error || !pages || pages.length === 0) {
      console.error('Error fetching page:', error);
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
    };
  } catch (error) {
    console.error('Error in getPageData:', error);
    return null;
  }
}

export default async function DynamicPage({ params }) {
  const pageData = await getPageData(params.slug);

  // Fallback content if WordPress data is not available
  if (!pageData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container section-padding">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-gradient">
              Page not found
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {pageData.yoast?.schema && (
        <Script id={`yoast-schema-${params.slug}`} type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify(pageData.yoast.schema)}
        </Script>
      )}

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
    </div>
  );
}

export async function generateMetadata({ params }) {
  const pageData = await getPageData(params.slug);
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
