// Utility functions for image handling and other common operations

/**
 * Get image URL from WordPress media object
 * @param {Object|number|string} mediaData - Media object, media ID, or URL string
 * @param {string} size - Image size (thumbnail, medium, large, full)
 * @returns {string|null} - Image URL or null if not found
 */
export function getImageUrl(mediaData, size = 'full') {
  if (!mediaData) return null;
  
  // If it's already a URL string, return it
  if (typeof mediaData === 'string' && mediaData.startsWith('http')) {
    return mediaData;
  }
  
  // If it's a media object from WordPress
  if (typeof mediaData === 'object' && mediaData !== null) {
    // If media_details and sizes are available, try to get the specific size
    if (mediaData.media_details && mediaData.media_details.sizes && mediaData.media_details.sizes[size]) {
      return mediaData.media_details.sizes[size].source_url;
    }
    
    // Fallback to source_url if specific size not available
    if (mediaData.source_url) {
      return mediaData.source_url;
    }
    
    // If it's an ACF image field format with url property
    if (mediaData.url) {
      return mediaData.url;
    }
  }
  
  return null;
}

/**
 * Get image alt text from WordPress media object
 * @param {Object} mediaData - Media object
 * @param {string} fallback - Fallback alt text
 * @returns {string} - Alt text
 */
export function getImageAlt(mediaData, fallback = 'Image') {
  if (!mediaData || typeof mediaData !== 'object') return fallback;
  
  return mediaData.alt_text || mediaData.alt || fallback;
}

/**
 * Check if a URL is external
 * @param {string} url - URL to check
 * @returns {boolean} - True if external
 */
export function isExternalUrl(url) {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}