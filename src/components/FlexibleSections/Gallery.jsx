'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { getImageUrl, getImageAlt } from '../../lib/utils';

// Import Lightbox
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";

const Gallery = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [galleryImages, setGalleryImages] = useState([]);
  const [visibleImages, setVisibleImages] = useState([]);
  const sectionRef = useRef(null);
  const imageRefs = useRef([]);

  const images = data?.images;

  // Intersection Observer for zoom-in animation
  useEffect(() => {
    if (!images || !Array.isArray(images) || images.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            setVisibleImages(prev => {
              if (!prev.includes(index)) {
                return [...prev, index];
              }
              return prev;
            });
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: '0px 0px 200px 0px'
      }
    );

    const currentRefs = imageRefs.current;
    currentRefs.forEach((ref, index) => {
      if (ref) {
        ref.dataset.index = index;
        observer.observe(ref);
      }
    });

    return () => {
      currentRefs.forEach(ref => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [images]);

  // Function to open lightbox with specific image
  const openLightbox = (imageIndex) => {
    // Format all images for lightbox
    const lightboxImages = images.map(imageId => {
      const imageUrl = typeof imageId === 'object' ? getImageUrl(imageId) : null;
      const imageAlt = typeof imageId === 'object' ? getImageAlt(imageId, 'Gallery image') : 'Gallery image';
      
      return {
        src: imageUrl || '',
        alt: imageAlt,
      };
    }).filter(img => img.src); // Filter out images without src
    
    setGalleryImages(lightboxImages);
    setImageIndex(imageIndex);
    setOpen(true);
  };

  // Function to create multiple grids with alternating layouts
  const createMultipleGrids = () => {
    const grids = [];
    let currentIndex = 0;
    let gridNumber = 1;
    
    while (currentIndex < images.length) {
      // Determine grid size: 3, 5, 3, 5, ...
      const gridSize = gridNumber % 2 === 1 ? 3 : 5;
      const gridImages = images.slice(currentIndex, currentIndex + gridSize);
      
      if (gridImages.length === 0) break;
      
      // Determine grid classes based on size
      const gridClasses = gridSize === 3 
        ? "grid grid-rows-2 grid-cols-12 gallery-row-1"
        : "grid grid-rows-2 grid-cols-12 gallery-row-2";
      
      const gridItems = gridImages.map((imageId, imgIndex) => {
        const globalIndex = currentIndex + imgIndex;
        const imageUrl = typeof imageId === 'object' ? getImageUrl(imageId) : null;
        const imageAlt = typeof imageId === 'object' ? getImageAlt(imageId, 'Gallery image') : 'Gallery image';
        const isVisible = visibleImages.includes(globalIndex);
        
        if (!imageUrl && typeof imageId !== 'number') return null;
        
        return (
          <div 
            key={globalIndex}
            ref={(el) => (imageRefs.current[globalIndex] = el)}
            className="group item aspect-square relative overflow-hidden cursor-pointer transition-all duration-1000 ease-out"
            onClick={() => openLightbox(globalIndex)}
            style={{
              transitionDelay: isVisible ? `${globalIndex * 200}ms` : '0ms'
            }}
          >
            {imageUrl ? (
              <>
                <div className={`w-full h-full overflow-hidden transition-all duration-500 ease-out ${
                  isVisible 
                    ? 'scale-100' 
                    : 'scale-0'
                }`}>
                  <Image
                    src={imageUrl}
                    alt={imageAlt}
                    fill
                    sizes="100vw"
                    className="object-cover object-center hover:scale-[1.2] transition-transform duration-[1s]"
                  />
                </div>
              </>
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
                <span className="text-gray-500 text-sm">Image ID: {imageId}</span>
              </div>
            )}
          </div>
        );
      });
      
      grids.push(
        <div key={gridNumber} className={`${gridClasses}`}>
          {gridItems}
        </div>
      );
      
      currentIndex += gridSize;
      gridNumber++;
    }
    
    return grids;
  };

  // Early return if no data or valid images
  if (!data || !images || !Array.isArray(images) || images.length === 0) {
    return null;
  }

  return (
    <section className="bg-white gallery-section">
      <div className="">
        {/* Multiple Gallery Grids */}
        {createMultipleGrids()}
      </div>
      
      {/* Lightbox Component */}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={galleryImages}
        index={imageIndex}
        plugins={[Zoom, Thumbnails]}
        zoom={{
          maxZoomPixelRatio: 3,
          zoomInMultiplier: 1.5,
        }}
        thumbnails={{
          position: 'bottom',
          width: 120,
          height: 80,
          border: 0,
          borderColor: '#ffffff',
          borderRadius: 4,
          padding: 4,
        }}
        styles={{
          container: {
            backgroundColor: 'rgba(0,0,0,0.8)',
          },
        }}
      />
    </section>
  );
};

export default Gallery;
