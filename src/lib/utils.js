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
  // Handle both flexible content sections and blog post ACF data
  const hasFlexibleContent = acfData?.flexible_content_sections && Array.isArray(acfData.flexible_content_sections);
  const hasBlogFields = acfData?.beplus_video || acfData?.beplus_gallery;

  if (!hasFlexibleContent && !hasBlogFields) {
    return acfData;
  }

  // Define exclusions per flexible layout (field names to skip from media replacement)
  const layoutExclusions = {
    image_boxes: new Set(["padding_top", "padding_bottom"]),
    hero_section: new Set(["hero_padding_top", "hero_padding_bottom"]),
    // add more layouts here if needed
  };

  // ---- STEP 1: Collect all numeric values (media IDs) recursively, respecting per-layout exclusions ----
  const mediaIds = new Set();
  const mediaIdPaths = new Map();

  function normalizeMediaId(value) {
    if (typeof value === "number" && Number.isInteger(value) && value > 0) {
      return value;
    }
    if (typeof value === "string" && /^\d+$/.test(value)) {
      const parsed = Number(value);
      return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
    }
    return null;
  }

  const MEDIA_FIELD_KEYS = new Set([
    // Generic media keys
    "image",
    "image_mobile",
    "images",
    "img",
    "gallery",
    "logos_gallery",
    "featured_image",
    "featured_media",
    "thumbnail",
    "thumb",
    "banner",
    "banner_image",
    "logo",
    "icon",
    "poster",
    "photo",
    "avatar",
    "attachment",
    "media_id",
    // Header / Footer
    "header_logo",
    "header_logo_mobile",
    "footer_logo",
    "footer_banner",
    // Section-specific image keys
    "hero_bg_image",
    "nav_bg_image",
    "background_image",
    // Blog ACF keys
    "beplus_gallery",
    "beplus_video",
    // Video/file fields that may be returned as attachment IDs
    "video",
    "video_url",
    "background_video",
    "background_video_mobile",
    "hero_bg_video_url",
    "hero_bg_video_url_mobile",
    "hero_bg_img_mobile",
    "bg_img_mobile",
  ]);

  function isLikelyMediaFieldKey(key = "") {
    const normalizedKey = String(key || "").toLowerCase();
    if (!normalizedKey) return false;
    if (MEDIA_FIELD_KEYS.has(normalizedKey)) return true;

    // Fallback for unknown but clearly media-related keys in ACF.
    return /(image|img|logo|icon|banner|gallery|thumbnail|thumb|photo|avatar|poster|featured_media|media_id|attachment|video)/i.test(
      normalizedKey
    );
  }

  function collectMediaIdsWithExclusions(
    value,
    excludedKeys = new Set(),
    currentKey = "",
    currentPath = ""
  ) {
    if (Array.isArray(value)) {
      value.forEach((v, index) =>
        collectMediaIdsWithExclusions(
          v,
          excludedKeys,
          currentKey,
          `${currentPath}[${index}]`
        )
      );
      return;
    }
    if (typeof value === "object" && value !== null) {
      for (const [key, v] of Object.entries(value)) {
        if (excludedKeys.has(key)) continue;
        const nextPath = currentPath ? `${currentPath}.${key}` : key;
        collectMediaIdsWithExclusions(v, excludedKeys, key, nextPath);
      }
      return;
    }

    // Only numeric values under media-like field keys should be treated as attachment IDs.
    if (!isLikelyMediaFieldKey(currentKey)) {
      return;
    }

    const mediaId = normalizeMediaId(value);
    if (mediaId) {
      mediaIds.add(mediaId);
      const paths = mediaIdPaths.get(mediaId) || new Set();
      paths.add(currentPath || currentKey || "<unknown>");
      mediaIdPaths.set(mediaId, paths);
    }
  }

  // Collect media IDs from flexible content sections
  if (hasFlexibleContent) {
    acfData.flexible_content_sections.forEach((section) => {
      const layout = section?.acf_fc_layout;
      const excluded = layout && layoutExclusions[layout] ? layoutExclusions[layout] : new Set();
      collectMediaIdsWithExclusions(section, excluded);
    });
  }

  // Collect media IDs from blog post fields
  if (hasBlogFields) {
    collectMediaIdsWithExclusions(acfData);
  }

  // ---- STEP 2: Fetch all media in a single request ----
  let mediaMap = {};
  if (mediaIds.size > 0) {
    try {
      const idsArray = Array.from(mediaIds);
      // getMedia should support array → return array of media
      const { data: mediaList, error } = await getMedia(idsArray);
      if (!error && Array.isArray(mediaList)) {
        mediaMap = Object.fromEntries(
          mediaList.map((m) => [
            m.id,
            {
              id: m.id,
              url: m.source_url,
              alt: m.alt_text || "Image",
              // mime_type: m.mime_type,
              width: m.media_details?.width,
              height: m.media_details?.height,
              sizes: m.media_details?.sizes,
            },
          ])
        );
      }
    } catch (err) {
      console.error("Error fetching media batch:", err);
    }
  }

  // ---- STEP 3: Replace numeric IDs with media data recursively ----
  function replaceMedia(value) {
    if (Array.isArray(value)) {
      return value.map(replaceMedia);
    } else if (typeof value === "object" && value !== null) {
      return Object.fromEntries(
        Object.entries(value).map(([k, v]) => [k, replaceMedia(v)])
      );
    }

    const mediaId = normalizeMediaId(value);
    if (mediaId && mediaMap[mediaId]) {
      return mediaMap[mediaId];
    }
    return value;
  }

  function replaceMediaWithExclusions(value, excludedKeys = new Set()) {
    if (Array.isArray(value)) {
      return value.map((v) => replaceMediaWithExclusions(v, excludedKeys));
    }
    if (typeof value === "object" && value !== null) {
      const entries = Object.entries(value).map(([k, v]) => {
        if (excludedKeys.has(k)) return [k, v];
        return [k, replaceMediaWithExclusions(v, excludedKeys)];
      });
      return Object.fromEntries(entries);
    }

    const mediaId = normalizeMediaId(value);
    if (mediaId && mediaMap[mediaId]) {
      return mediaMap[mediaId];
    }
    return value;
  }

  // ---- STEP 4: Replace media IDs in the data ----
  let processedData = { ...acfData };

  if (hasFlexibleContent) {
    processedData.flexible_content_sections = acfData.flexible_content_sections.map((section) => {
      const layout = section?.acf_fc_layout;
      const excluded = layout && layoutExclusions[layout] ? layoutExclusions[layout] : new Set();
      return replaceMediaWithExclusions(section, excluded);
    });
  }

  // Process blog post fields
  if (hasBlogFields) {
    processedData = replaceMedia(processedData);
  }

  if (mediaIds.size > 0) {
    const unresolvedIds = Array.from(mediaIds).filter((id) => !mediaMap[id]);
    if (unresolvedIds.length > 0) {
      console.warn(`[media] Unresolved media IDs: ${unresolvedIds.join(", ")}`);
      unresolvedIds.forEach((id) => {
        const paths = Array.from(mediaIdPaths.get(id) || []);
        if (paths.length > 0) {
          console.warn(`[media] ID ${id} found at: ${paths.join(" | ")}`);
        }
      });
    }
  }

  return processedData;
}

// Format date helper
export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Extract YouTube video ID from URL
export function getYouTubeVideoId(url) {
  if (!url) return null;

  // Handle different YouTube URL formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  return (match && match[2].length === 11) ? match[2] : null;
};

// Get YouTube thumbnail URL from video URL
export function getYouTubeThumbnailUrl(url) {
  if (!url) return null;
  const videoId = getYouTubeVideoId(url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
};
