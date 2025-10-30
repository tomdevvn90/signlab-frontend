'use client';

import React, { useState, useEffect, useRef } from 'react';
import { getImageUrl, getImageAlt } from '../../lib/utils';

// Import Lightbox
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { RowsPhotoAlbum} from 'react-photo-album';
import "react-photo-album/rows.css";

const DEFAULT_IMAGES_PER_PAGE = 12;

const Gallery = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [galleryImages, setGalleryImages] = useState([]);
  const [visibleCount, setVisibleCount] = useState(DEFAULT_IMAGES_PER_PAGE);
  const images = data?.images;

  // Normalize photos for react-photo-album and lightbox
  const photos = Array.isArray(images)
    ? images
        .map((imageObj) => {
          const src = typeof imageObj === 'object' ? getImageUrl(imageObj) : null;
          const alt = typeof imageObj === 'object' ? getImageAlt(imageObj, 'Gallery image') : 'Gallery image';
          const width = (imageObj && (imageObj.width || imageObj?.media_details?.width || imageObj?.sizes?.full?.width)) || 1200;
          const height = (imageObj && (imageObj.height || imageObj?.media_details?.height || imageObj?.sizes?.full?.height)) || 800;
          if (!src) return null;
          return { src, width: width || 1200, height: height || 800, alt };
        })
        .filter(Boolean)
    : [];

  useEffect(() => {
    if (photos.length > 0) {
      setGalleryImages(photos.map((p) => ({ src: p.src, alt: p.alt })));
    }
  }, [images]);

  // Open lightbox at index
  const openLightbox = (index) => {
    setImageIndex(index);
    setOpen(true);
  };

  // Load more handler
  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + DEFAULT_IMAGES_PER_PAGE, photos.length));
  };

  // Early return if no data or valid images
  if (!data || !images || !Array.isArray(images) || images.length === 0) {
    return null;
  }

  return (
    <section className="bg-white gallery-section relative">
      <div className="relative pb-[5px] md:pb-[10px]">
        <RowsPhotoAlbum
          photos={photos.slice(0, visibleCount)}
          onClick={({ index }) => openLightbox(index)}
          spacing={(containerWidth) => (containerWidth < 640 ? 5 : 10)}
          rowConstraints={(containerWidth) => ({
            maxPhotos: containerWidth < 640 ? 2 : 4,
          })}
        />
        {visibleCount < photos.length && (
          <div className="flex justify-center absolute z-10 left-[50%] translate-x-[-50%] translate-y-[-50%]">
            <button
              onClick={handleLoadMore}
              className="btn-primary !rounded-full transition-colors duration-200 uppercase tracking-wide"
            >
              Load More
            </button>
          </div>
        )}
      </div>
      {/* Lightbox Component */}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={galleryImages}
        index={imageIndex}
        plugins={[Zoom, Thumbnails]}
        zoom={{ maxZoomPixelRatio: 3, zoomInMultiplier: 1.5 }}
        thumbnails={{ position: 'bottom', width: 120, height: 80, border: 0, borderColor: '#ffffff', borderRadius: 4, padding: 4 }}
        styles={{ container: { backgroundColor: 'rgba(0,0,0,0.8)' } }}
      />
    </section>
  );
};

export default Gallery;
