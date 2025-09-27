// WordPress API configuration
const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL

// Base fetch function with error handling
async function fetchWpApi(url) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 }, // ISR: revalidate every 60 seconds
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('WordPress API Error:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}

// Get all pages
export async function getPages() {
  const url = `${WP_API_URL}/pages?per_page=100&_embed=1`;
  return fetchWpApi(url);
}

// Get page by slug
export async function getPageBySlug(slug) {
  const url = `${WP_API_URL}/pages?slug=${slug}&_embed=1`;
  console.log(url);
  return fetchWpApi(url);
}

// Get page by ID
export async function getPageById(id) {
  const url = `${WP_API_URL}/pages/${id}?_embed=1`;
  return fetchWpApi(url);
}

// Get all posts
export async function getPosts(perPage = 10) {
  const url = `${WP_API_URL}/posts?per_page=${perPage}&_embed=1`;
  return fetchWpApi(url);
}

// Get post by slug
export async function getPostBySlug(slug) {
  const url = `${WP_API_URL}/posts?slug=${slug}&_embed=1`;
  return fetchWpApi(url);
}

// Get media by ID
export async function getMedia(mediaId) {
  const url = `${WP_API_URL}/media/${mediaId}`;
  return fetchWpApi(url);
}

// Helper function to get featured image URL
export function getFeaturedImageUrl(post) {
  if (post._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
    return post._embedded['wp:featuredmedia'][0].source_url;
  }
  return null;
}

// Helper function to get featured image alt text
export function getFeaturedImageAlt(post) {
  if (post._embedded?.['wp:featuredmedia']?.[0]?.alt_text) {
    return post._embedded['wp:featuredmedia'][0].alt_text;
  }
  return post.title.rendered;
}

// Helper function to process ACF flexible content
export function processFlexibleContent(acfData) {
  if (!acfData || !Array.isArray(acfData)) {
    return [];
  }
  return acfData;
}
