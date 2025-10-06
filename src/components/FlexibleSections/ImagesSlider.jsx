'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { getImageUrl, getImageAlt } from '../../lib/utils';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Import Lightbox
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";

const ImagesSlider = ({ data }) => {
  // Always call hooks at the top level, before any return or conditional
  const swiperRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [slideImages, setSlideImages] = useState([]);

  // Early return if no data
  if (!data) return null;

  const { title, auto_play, autoplay_per_second, slider_items } = data;

  // Early return if no valid slider items
  if (!slider_items || !Array.isArray(slider_items) || slider_items.length === 0) {
    return null;
  }

  // Function to open lightbox with specific image
  const openLightbox = (images, index) => {
    // Format images for lightbox
    const lightboxImages = images.map(imageId => {
      const imageUrl = typeof imageId === 'object' ? getImageUrl(imageId) : null;
      const imageAlt = typeof imageId === 'object' ? getImageAlt(imageId, 'Gallery image') : 'Gallery image';
      
      return {
        src: imageUrl || '',
        alt: imageAlt,
      };
    }).filter(img => img.src); // Filter out images without src
    
    setSlideImages(lightboxImages);
    setImageIndex(index);
    setOpen(true);
  };

  return (
    <section className="pb-40 bg-white images-slider">
      <div className="px-24">
        {title && (
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-center py-20 primary-color">
            {title}
          </h2>
        )}

        <div className="relative images-slider-container">
          <Swiper
            ref={swiperRef}
            modules={[Autoplay, Navigation, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            // pagination={{ clickable: true }}
            autoplay={auto_play ? {
              delay: (autoplay_per_second || 3) * 1000,
              disableOnInteraction: false,
            } : false}
            className="images-slider"
          >
            {slider_items.map((item, index) => {
              // Handle images array for each slide
              const images = Array.isArray(item.images) ? item.images : [];
              
              if (images.length === 0) return null;
              
              return (
                <SwiperSlide key={index}>
                  <div className="grid grid-cols-12 gap-6">
                    {images.map((imageId, imgIndex) => {
                      // Handle image data - could be an ID or object
                      const imageUrl = typeof imageId === 'object' 
                        ? getImageUrl(imageId) 
                        : null; // Will be resolved by API
                      
                      const imageAlt = typeof imageId === 'object'
                        ? getImageAlt(imageId, 'Gallery image')
                        : 'Gallery image';
                        
                      if (!imageUrl && typeof imageId !== 'number') return null;
                      
                      return (
                        <div 
                          key={imgIndex} 
                          className="group grid-item aspect-square relative overflow-hidden shadow-lg h-[300px] w-full cursor-pointer"
                          onClick={() => openLightbox(images, imgIndex)}
                        >
                          {imageUrl ? (
                            <>
                              <Image
                                src={imageUrl}
                                alt={imageAlt}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 50vw"
                                className="object-cover hover:scale-110 transition-transform duration-1000"
                              />
                              <div className="img-overlay absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300 flex items-center justify-center">
                                <div className="text-white opacity-0 group-hover:opacity-80 transition-opacity duration-300">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                  </svg>
                                </div>
                              </div>
                            </>
                          ) : (
                            // Placeholder for when we have an ID but no resolved URL yet
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <span>Image ID: {imageId}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
          
          <div className="swiper-button-prev w-10 rotate-180">
            <Image
              src="/images/slider-arrow.png"
              alt=""
              width={40}
              height={58}
              priority
              className="w-[24px] h-[32px] xl:w-[30px] xl:h-[40px] 2xl:w-[40px] 2xl:h-[58px]"
            />
          </div>
          <div className="swiper-button-next w-10">
            <Image
              src="/images/slider-arrow.png"
              alt=""
              width={40}
              height={58}
              priority
              className="w-[24px] h-[32px] xl:w-[30px] xl:h-[40px] 2xl:w-[40px] 2xl:h-[58px]"
            />
          </div>
        </div>
      </div>
      
      {/* Lightbox Component */}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slideImages}
        index={imageIndex}
        plugins={[Zoom, Thumbnails]}
        zoom={{
          maxZoomPixelRatio: 3,
          zoomInMultiplier: 1.5,
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

export default ImagesSlider;