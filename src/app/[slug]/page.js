import React from 'react';
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
