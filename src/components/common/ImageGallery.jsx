'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { getImageUrl, getImageAlt } from '../../lib/utils';

// Import Lightbox
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";

const ImageGallery = ({ galleryImages }) => {
  const [open, setOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [lightboxImages, setLightboxImages] = useState([]);

  // Function to open lightbox with specific image
  const openLightbox = (imageIndex) => {
    const lightboxImages = galleryImages.map(imageId => {
      const imageUrl = typeof imageId === 'object' ? getImageUrl(imageId) : null;
      const imageAlt = typeof imageId === 'object' ? getImageAlt(imageId, 'Gallery image') : 'Gallery image';
      
      return {
        src: imageUrl || '',
        alt: imageAlt,
      };
    }).filter(img => img.src);
    
    setLightboxImages(lightboxImages);
    setImageIndex(imageIndex);
    setOpen(true);
  };

  if (!galleryImages || !Array.isArray(galleryImages) || galleryImages.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {galleryImages.map((image, index) => {
        const imageUrl = getImageUrl(image, 'medium');
        const imageAlt = getImageAlt(image, `Gallery image ${index + 1}`);
        
        return (
          <div
            key={index + 1}
            className="relative aspect-square cursor-pointer group overflow-hidden shadow-md"
            onClick={() => openLightbox(index + 1)}
          >
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                  />
                </svg>
              </div>
            </div>
          </div>
        );
      })}

      {/* Lightbox Component */}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={lightboxImages}
        index={imageIndex}
        plugins={[Zoom, Thumbnails]}
        zoom={{
          maxZoomPixelRatio: 3,
          zoomInMultiplier: 1.5,
        }}
        thumbnails={{
          position: 'bottom',
          width: 100,
          height: 80,
          border: 0,
          borderColor: '#ffffff',
          borderRadius: 4,
          padding: 4,
          gap: 6,
        }}
        styles={{
          container: {
            backgroundColor: 'rgba(0,0,0,0.8)',
          },
        }}
      />
    </div>
  );
};

export default ImageGallery;
