// Utility functions for image handling and other common operations
import { getMedia } from './api';

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

// Helper function to process flexible content and automatically fetch media for numeric fields (image IDs)
export async function processFlexibleContent(acfData) {
  if (!acfData?.flexible_content_sections || !Array.isArray(acfData.flexible_content_sections)) {
    return acfData;
  }
  /**
   * Recursively walk through arrays/objects to find numeric values.
   * If a number is found, assume it's a WordPress media ID and fetch its details.
   */
  async function resolveMedia(value) {
    if (Array.isArray(value)) {
      // Recursively resolve each element in the array
      return Promise.all(value.map(resolveMedia));
    } else if (typeof value === "object" && value !== null) {
      // Recursively resolve each key/value pair in the object
      const entries = await Promise.all(
        Object.entries(value).map(async ([k, v]) => [k, await resolveMedia(v)])
      );
      return Object.fromEntries(entries);
    } else if (typeof value === "number" && value > 0) {
      // Treat numbers as media IDs → fetch the media details
      try {
        const { data: media, error } = await getMedia(value);
        if (!error && media) {
          return {
            id: media.id,
            url: media.source_url,
            alt: media.alt_text || "Image",
            mime_type: media.mime_type,
            width: media.media_details?.width,
            height: media.media_details?.height,
            sizes: media.media_details?.sizes
          };
        }
      } catch (err) {
        console.error("Error fetching media:", err);
      }
    }
    // Return unchanged if not an array, object, or number (media ID)
    return value;
  }

  // Process each section in flexible_content_sections
  const processedSections = await Promise.all(
    acfData.flexible_content_sections.map(async (section) => {
      return await resolveMedia(section);
    })
  );

  // Return the updated ACF data with processed media
  return {
    ...acfData,
    flexible_content_sections: processedSections,
  };
}