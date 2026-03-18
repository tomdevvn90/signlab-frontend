// WordPress API configuration
const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL

function getWpAuthHeader() {
  // Preferred: precomputed Basic token (base64 of username:application_password)
  if (process.env.WP_API_BASIC_AUTH_TOKEN) {
    return `Basic ${process.env.WP_API_BASIC_AUTH_TOKEN}`;
  }

  // Alternative: compose from username + application password
  if (process.env.WP_API_USERNAME && process.env.WP_API_APPLICATION_PASSWORD) {
    const credentials = `${process.env.WP_API_USERNAME}:${process.env.WP_API_APPLICATION_PASSWORD}`;
    return `Basic ${Buffer.from(credentials).toString('base64')}`;
  }

  return null;
}

// Base fetch function with error handling
async function fetchWpApi(url, revalidate = 0) {
  try {
    const authHeader = getWpAuthHeader();
    const headers = {
      'Content-Type': 'application/json',
    };
    if (authHeader) {
      headers.Authorization = authHeader;
    }

    const response = await fetch(url, {
      headers,
      next: { revalidate: revalidate }, // ISR: revalidate every 60 seconds
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        console.error(`WordPress API auth error (${response.status}) for URL: ${url}`);
      }
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
export async function getPages(perPage = 10, page = 1) {
  const url = `${WP_API_URL}/pages?per_page=${perPage}&page=${page}`;
  return fetchWpApi(url);
}

// Get page by slug
export async function getPageBySlug(slug) {
  const url = `${WP_API_URL}/pages?slug=${slug}&_embed=1`;
  // console.log(url);
  return fetchWpApi(url);
}

// Get page by ID
export async function getPageById(id) {
  const url = `${WP_API_URL}/pages/${id}?_embed=1`;
  return fetchWpApi(url);
}

// Get all posts
export async function getPosts(perPage = 10, page = 1) {
  const url = `${WP_API_URL}/posts?per_page=${perPage}&page=${page}`;
  return fetchWpApi(url);
}

// Get post by slug
export async function getPostBySlug(slug) {
  const url = `${WP_API_URL}/posts?slug=${slug}&_embed=1`;
  return fetchWpApi(url);
}

// Get media by ID
// Accepts a single media ID or an array of media IDs
export async function getMedia(mediaIds) {
  if (!mediaIds) return { data: null, error: 'No media ID(s) provided' };

  // If a single ID is provided, convert to array for uniformity
  const idsArray = Array.isArray(mediaIds) ? mediaIds : [mediaIds];

  // If empty array, return empty data
  if (idsArray.length === 0) return { data: [], error: null };

  // If only one ID, use the single endpoint for efficiency
  if (idsArray.length === 1) {
    const url = `${WP_API_URL}/media/${idsArray[0]}`;
    return fetchWpApi(url, 120);
  }

  // WordPress REST API has a max per_page of 100, so we batch requests
  const MAX_PER_PAGE = 50;
  const allMedia = [];

  for (let i = 0; i < idsArray.length; i += MAX_PER_PAGE) {
    const batch = idsArray.slice(i, i + MAX_PER_PAGE);
    const idsParam = batch.join(',');
    const url = `${WP_API_URL}/media?include=${idsParam}&per_page=${batch.length}`;
    const { data, error } = await fetchWpApi(url, 120);

    if (error) {
      return { data: null, error };
    }

    if (Array.isArray(data)) {
      allMedia.push(...data);
    }
  }

  return { data: allMedia, error: null };
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

// Get theme options (header and footer data)
export async function getThemeOptions() {
  // Fetch the home page to get theme options
  const { data: pages, error } = await getPageBySlug('home');

  if (error || !pages || pages.length === 0) {
    return null;
  }

  return pages[0]?.theme_options || null;
}
