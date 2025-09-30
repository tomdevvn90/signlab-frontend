/**
 * Get image URL from a WP media object
 * @param {object} media - WP REST API media object
 * @param {string} size - image size (thumbnail, medium, large, full, custom...)
 * @returns {string|null} - URL of the image or null if not found
 */
export const getImageUrl = (media, size = "full") => {
    if (!media) return null;
  
    if (
      size !== "full" &&
      media.media_details &&
      media.media_details.sizes &&
      media.media_details.sizes[size] &&
      media.media_details.sizes[size].source_url
    ) {
      return media.media_details.sizes[size].source_url;
    }
  
    // fallback: full image
    if (media.source_url) {
      return media.source_url;
    }
  
    return null;
};

// Helper function to get media URL from media ID
export async function getMediaUrl(mediaId) {
    if (!mediaId) return null;
    
    // If it's already a full URL, return it
    if (typeof mediaId === 'string' && mediaId.startsWith('http')) {
      return mediaId;
    }
    
    // If it's a media ID, fetch the media details
    if (typeof mediaId === 'number' || (typeof mediaId === 'string' && !isNaN(mediaId))) {
      try {
        const { data: media, error } = await getMedia(mediaId);
        if (error || !media) {
          console.error('Error fetching media:', error);
          return null;
        }
        return media.source_url;
      } catch (error) {
        console.error('Error in getMediaUrl:', error);
        return null;
      }
    }
    
    return null;
  }