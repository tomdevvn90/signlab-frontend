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
  const [visibleRows, setVisibleRows] = useState(1); // Track how many grid rows are visible
  const [isInitialLoad, setIsInitialLoad] = useState(true); // Track if this is the initial load
  const [newlyLoadedRows, setNewlyLoadedRows] = useState([]); // Track newly loaded rows for animation

  const images = data?.images;

  // Calculate total number of grid rows
  const calculateTotalRows = () => {
    if (!images || !Array.isArray(images)) return 0;
    
    let currentIndex = 0;
    let gridNumber = 1;
    
    while (currentIndex < images.length) {
      const gridSize = gridNumber % 2 === 1 ? 3 : 5;
      currentIndex += gridSize;
      gridNumber++;
    }
    
    return gridNumber - 1; // Subtract 1 because gridNumber increments after the last iteration
  };

  const totalRows = calculateTotalRows();

  // Function to handle load more
  const handleLoadMore = () => {
    const nextRow = visibleRows + 1;
    setVisibleRows(prev => Math.min(prev + 1, totalRows));
    setNewlyLoadedRows(prev => [...prev, nextRow]);
    
    // Remove the row from newly loaded after animation completes
    setTimeout(() => {
      setNewlyLoadedRows(prev => prev.filter(row => row !== nextRow));
    }, 1000); // Match the animation duration
  };

  // Handle initial load animation
  useEffect(() => {
    if (isInitialLoad) {
      const timer = setTimeout(() => {
        setIsInitialLoad(false);
      }, 100); // Small delay to ensure initial render
      return () => clearTimeout(timer);
    }
  }, [isInitialLoad]);

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
      // Only render grids up to visibleRows
      if (gridNumber > visibleRows) break;
      
      // Determine grid size: 3, 5, 3, 5, ...
      const gridSize = gridNumber % 2 === 1 ? 3 : 5;
      const gridImages = images.slice(currentIndex, currentIndex + gridSize);
      
      if (gridImages.length === 0) break;
      
      // Determine grid classes based on size
      const gridClasses = gridSize === 3 
        ? "grid grid-rows-1 grid-cols-1 sm:grid-rows-2 sm:grid-cols-12 gallery-row-1"
        : "grid grid-rows-1 grid-cols-1 sm:grid-rows-2 sm:grid-cols-12 gallery-row-2";
      
      const gridItems = gridImages.map((imageId, imgIndex) => {
        const globalIndex = currentIndex + imgIndex;
        const imageUrl = typeof imageId === 'object' ? getImageUrl(imageId) : null;
        const imageAlt = typeof imageId === 'object' ? getImageAlt(imageId, 'Gallery image') : 'Gallery image';
        
        // Determine if this row should have entrance animation
        const shouldAnimate = isInitialLoad || newlyLoadedRows.includes(gridNumber);
        const animationDelay = shouldAnimate ? `${imgIndex * 150}ms` : '0ms';
        
        if (!imageUrl && typeof imageId !== 'number') return null;
        
        return (
          <div 
            key={globalIndex}
            className="group item aspect-square relative overflow-hidden cursor-pointer"
            onClick={() => openLightbox(globalIndex)}
          >
            {imageUrl ? (
              <>
                <div 
                  className={`w-full h-full overflow-hidden transition-all duration-400 ease-out ${
                    shouldAnimate 
                      ? 'opacity-0 scale-0' 
                      : 'opacity-100 scale-100'
                  }`}
                  style={{
                    transitionDelay: animationDelay,
                    animationName: shouldAnimate ? 'zoomIn' : 'none',
                    animationDuration: shouldAnimate ? '0.4s' : 'none',
                    animationTimingFunction: shouldAnimate ? 'ease-out' : 'none',
                    animationFillMode: shouldAnimate ? 'forwards' : 'none',
                    animationDelay: shouldAnimate ? animationDelay : '0ms'
                  }}
                >
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
    <section className="bg-white gallery-section relative">
      <div className="">
        {/* Multiple Gallery Grids */}
        {createMultipleGrids()}
        
        {/* Load More Button */}
        {visibleRows < totalRows && (
          <div className="flex justify-center absolute left-[50%] translate-x-[-50%] translate-y-[-50%]">
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
