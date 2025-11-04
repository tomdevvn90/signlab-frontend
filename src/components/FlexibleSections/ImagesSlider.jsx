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

  const { title, auto_play, autoplay_per_second, images, padding_top, padding_bottom, background_color } = data;

  // Early return if no valid images
  if (!images || !Array.isArray(images) || images.length === 0) {
    return null;
  }

  // Compose class string for section
  let sectionClasses = 'images-slider';
  if (padding_top && padding_bottom) {
    sectionClasses = `py-24 xl:py-40 ${sectionClasses}`;
  } else if (padding_top) {
    sectionClasses = `pt-24 xl:pt-40 ${sectionClasses}`;
  } else if (padding_bottom) {
    sectionClasses = `pb-24 xl:pb-40 ${sectionClasses}`;
  }
  // bg color will be assigned inline-style

  // Compose style for background color
  const sectionStyle = background_color
    ? { backgroundColor: background_color }
    : { backgroundColor: '#fff' };

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
    
    setSlideImages(lightboxImages);
    setImageIndex(imageIndex);
    setOpen(true);
  };

  // Function to chunk images into slides based on screen size
  const chunkImages = (imagesArray, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < imagesArray.length; i += chunkSize) {
      chunks.push(imagesArray.slice(i, i + chunkSize));
    }
    return chunks;
  };

  return (
    <section
      className={sectionClasses}
      style={sectionStyle}
    >
      <div className="px-12 lg:px-16 xl:px-24">
        {title && (
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-center py-20 primary-color">
            {title}
          </h2>
        )}

        <div className="relative images-slider-container">
          {/* Mobile: 1 image per slide */}
          <div className="block md:hidden">
            <Swiper
              ref={swiperRef}
              modules={[Autoplay, Navigation, Pagination]}
              spaceBetween={20}
              slidesPerView={1}
              navigation={{
                nextEl: '.swiper-button-next-mobile',
                prevEl: '.swiper-button-prev-mobile',
              }}
              autoplay={auto_play ? {
                delay: (autoplay_per_second || 3) * 1000,
                disableOnInteraction: false,
              } : false}
              className="images-slider"
            >
              {images.map((imageId, index) => {
                const imageUrl = typeof imageId === 'object' ? getImageUrl(imageId) : null;
                const imageAlt = typeof imageId === 'object' ? getImageAlt(imageId, 'Gallery image') : 'Gallery image';
                
                if (!imageUrl && typeof imageId !== 'number') return null;
                
                return (
                  <SwiperSlide key={index}>
                    <div 
                      className="group aspect-square relative overflow-hidden shadow-lg h-[300px] w-full cursor-pointer"
                      onClick={() => openLightbox(index)}
                    >
                      {imageUrl ? (
                        <>
                          <Image
                            src={imageUrl}
                            alt={imageAlt}
                            fill
                            sizes="100vw"
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
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span>Image ID: {imageId}</span>
                        </div>
                      )}
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>

          {/* Tablet: 3 images per slide */}
          <div className="hidden md:block lg:hidden">
            <Swiper
              ref={swiperRef}
              modules={[Autoplay, Navigation, Pagination]}
              spaceBetween={20}
              slidesPerView={1}
              navigation={{
                nextEl: '.swiper-button-next-tablet',
                prevEl: '.swiper-button-prev-tablet',
              }}
              autoplay={auto_play ? {
                delay: (autoplay_per_second || 3) * 1000,
                disableOnInteraction: false,
              } : false}
              className="images-slider"
            >
              {chunkImages(images, 3).map((slideImages, slideIndex) => (
                <SwiperSlide key={slideIndex}>
                  <div className="grid grid-cols-3 gap-6">
                    {slideImages.map((imageId, imgIndex) => {
                      const imageUrl = typeof imageId === 'object' ? getImageUrl(imageId) : null;
                      const imageAlt = typeof imageId === 'object' ? getImageAlt(imageId, 'Gallery image') : 'Gallery image';
                      const globalIndex = slideIndex * 3 + imgIndex;
                      
                      if (!imageUrl && typeof imageId !== 'number') return null;
                      
                      return (
                        <div 
                          key={imgIndex} 
                          className="group aspect-square relative overflow-hidden shadow-lg h-[300px] w-full cursor-pointer"
                          onClick={() => openLightbox(globalIndex)}
                        >
                          {imageUrl ? (
                            <>
                              <Image
                                src={imageUrl}
                                alt={imageAlt}
                                fill
                                sizes="33vw"
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
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <span>Image ID: {imageId}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Desktop: 7 images per slide */}
          <div className="hidden lg:block">
            <Swiper
              ref={swiperRef}
              modules={[Autoplay, Navigation, Pagination]}
              spaceBetween={30}
              slidesPerView={1}
              navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              }}
              autoplay={auto_play ? {
                delay: (autoplay_per_second || 3) * 1000,
                disableOnInteraction: false,
              } : false}
              className="images-slider"
            >
              {chunkImages(images, 7).map((slideImages, slideIndex) => (
                <SwiperSlide key={slideIndex}>
                  <div className="grid grid-cols-12 gap-6">
                    {slideImages.map((imageId, imgIndex) => {
                      const imageUrl = typeof imageId === 'object' ? getImageUrl(imageId) : null;
                      const imageAlt = typeof imageId === 'object' ? getImageAlt(imageId, 'Gallery image') : 'Gallery image';
                      const globalIndex = slideIndex * 7 + imgIndex;
                      
                      if (!imageUrl && typeof imageId !== 'number') return null;
                      
                      return (
                        <div 
                          key={imgIndex} 
                          className="group grid-item aspect-square relative overflow-hidden shadow-lg h-[300px] w-full cursor-pointer"
                          onClick={() => openLightbox(globalIndex)}
                        >
                          {imageUrl ? (
                            <>
                              <Image
                                src={imageUrl}
                                alt={imageAlt}
                                fill
                                sizes="70vw"
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
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <span>Image ID: {imageId}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          
          {/* Mobile Navigation */}
          <div className="swiper-button-prev-mobile md:hidden w-10 rotate-180">
            <Image
              src="/images/right-blu-chevron.svg"
              alt=""
              width={40}
              height={58}
              priority
              className="w-[24px] h-[32px]"
            />
          </div>
          <div className="swiper-button-next-mobile md:hidden w-10">
            <Image
              src="/images/right-blu-chevron.svg"
              alt=""
              width={40}
              height={58}
              priority
              className="w-[24px] h-[32px]"
            />
          </div>

          {/* Tablet Navigation */}
          <div className="swiper-button-prev-tablet hidden md:block lg:hidden w-10 rotate-180">
            <Image
              src="/images/right-blu-chevron.svg"
              alt=""
              width={40}
              height={58}
              priority
              className="w-[24px] h-[32px] xl:w-[30px] xl:h-[40px]"
            />
          </div>
          <div className="swiper-button-next-tablet hidden md:block lg:hidden w-10">
            <Image
              src="/images/right-blu-chevron.svg"
              alt=""
              width={40}
              height={58}
              priority
              className="w-[24px] h-[32px] xl:w-[30px] xl:h-[40px]"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="swiper-button-prev w-10 rotate-180">
            <Image
              src="/images/right-blu-chevron.svg"
              alt=""
              width={40}
              height={58}
              priority
              className="w-[24px] h-[32px] xl:w-[30px] xl:h-[40px] 2xl:w-[40px] 2xl:h-[58px]"
            />
          </div>
          <div className="swiper-button-next w-10">
            <Image
              src="/images/right-blu-chevron.svg"
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

export default ImagesSlider;