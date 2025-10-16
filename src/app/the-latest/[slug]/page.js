import React from 'react';
import { getPostBySlug } from '../../../lib/api';
import { processFlexibleContent } from '../../../lib/utils';
import BlogPost from '../../../components/BlogPost';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

// ISR: This page will be statically generated and revalidated every 60 seconds
export const revalidate = 60;

async function getBlogPostData(slug) {
  try {
    const { data: posts, error } = await getPostBySlug(slug);
    
    if (error || !posts || posts.length === 0) {
      console.error('Error fetching blog post:', error);
      return null;
    }

    const post = posts[0];
    
    // Process the ACF data to handle media IDs
    const processedAcf = await processFlexibleContent(post.acf || {});
    
    return {
      id: post.id,
      title: post.title.rendered,
      content: post.content.rendered,
      excerpt: post.excerpt.rendered,
      slug: post.slug,
      date: post.date,
      modified: post.modified,
      author: post._embedded?.['author']?.[0] || null,
      categories: post._embedded?.['wp:term']?.[0] || [],
      tags: post._embedded?.['wp:term']?.[1] || [],
      acf: processedAcf,
      featured_image: post._embedded?.['wp:featuredmedia']?.[0] || null,
      yoast: post.yoast_head_json || null,
      theme_options: post.theme_options || null,
    };
  } catch (error) {
    console.error('Error in getBlogPostData:', error);
    return null;
  }
}

export default async function BlogPostPage({ params }) {
  const postData = await getBlogPostData(params.slug);
  const themeOptions = postData.theme_options;

  // Fallback content if WordPress data is not available
  if (!postData) {
    return (
      <div className="post">
        <Header headerData={themeOptions} />

        <main className="site-main min-h-screen">
          <div className="min-h-screen bg-gray-50">
            <div className="container section-padding">
              <div className="text-center">
                <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-gradient">
                  Blog Post Not Found
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  {`The blog post you're looking for doesn't exist or has been moved.`}
                </p>
                <a href="/the-latest" className="btn-primary">
                  Back to The Latest
                </a>
              </div>
            </div>
          </div>
        </main>
        <Footer footerData={themeOptions} />
    </div>
    );
  }

  return (
    <div className="post">
      <Header headerData={themeOptions} />
        <main className="site-main min-h-screen">
          <BlogPost post={postData} />
        </main>
      <Footer footerData={themeOptions} />
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const postData = await getBlogPostData(params.slug);
  
  if (!postData) {
    return {
      title: 'Blog Post Not Found',
      description: 'The blog post you\'re looking for doesn\'t exist.',
    };
  }

  return {
    title: postData.title,
    description: postData.excerpt.replace(/<[^>]*>/g, '').substring(0, 160),
    openGraph: {
      title: postData.title,
      description: postData.excerpt.replace(/<[^>]*>/g, '').substring(0, 160),
      type: 'article',
      publishedTime: postData.date,
      modifiedTime: postData.modified,
      authors: postData.author ? [postData.author.name] : undefined,
      images: postData.featured_image ? [postData.featured_image.source_url] : undefined,
    },
  };
}
