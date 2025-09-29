import React from 'react';
import { getPageBySlug } from '../../lib/api';
import FlexibleContent from '../../components/FlexibleContent';

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
    
    return {
      id: page.id,
      title: page.title.rendered,
      content: page.content.rendered,
      slug: page.slug,
      acf: page.acf || {},
    };
  } catch (error) {
    console.error('Error in getContactPageData:', error);
    return null;
  }
}

export default async function ContactPage() {
  const pageData = await getContactPageData();

  // Fallback content if WordPress data is not available
  if (!pageData) {
    return (
      <div className="min-h-screen">
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white section-padding">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 fade-in">Page not found</h1>
            </div>
          </div>
        </section>
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

      <div className="container section-padding">
        Contact Form Here
      </div>
    </div>
  );
}
