'use client';

import React, { useRef, useState, useEffect, useCallback, useId } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';
import { getImageUrl, getImageAlt } from '../../lib/utils';
import ArrowIcon from '../common/ArrowIcon';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const HeroSlider = ({ data }) => {
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  
  const componentId = useId().replace(/:/g, '');
  const prevClass = `hero-slider-prev-${componentId}`;
  const nextClass = `hero-slider-next-${componentId}`;
  const paginationClass = `hero-slider-pagination-${componentId}`;

  if (!data) return null;

  const { settings, slider_items, image_position, content_position, color_scheme } = data;

  if (!slider_items || !Array.isArray(slider_items) || slider_items.length === 0) {
    return null;
  }

  // Settings
  const showArrows = settings?.arrows !== false;
  const showDots = settings?.dots !== false;
  const autoPlay = settings?.auto_play !== false;
  const autoplayDelay = (settings?.autoplay_per_second || 3) * 1000;

  // Color scheme
  const titleColor = color_scheme?.title_color || '#ffffff';
  const descColor = color_scheme?.description_color || '#eeeeee';
  const overlayColor = color_scheme?.overlay_color || '';
  const bgColor = color_scheme?.background_color || '#0051bc';

  // Layout settings
  const imgPosition = image_position || 'full';
  const isFullImage = imgPosition === 'full';

  // Content position classes (only applies when image_position is "full")
  let contentPositionClass = 'items-center justify-center text-center';
  if (isFullImage) {
    switch ((content_position || 'center').toLowerCase()) {
      case 'left':
        contentPositionClass = 'items-start justify-center text-left';
        break;
      case 'right':
        contentPositionClass = 'items-end justify-center text-right';
        break;
      case 'center':
      default:
        contentPositionClass = 'items-center justify-center text-center';
        break;
    }
  }

  // Trigger content animation on slide change
  const handleSlideChange = (swiper) => {
    setIsAnimating(false);
    setActiveIndex(swiper.realIndex);
    // Small timeout to retrigger the CSS animation
    setTimeout(() => setIsAnimating(true), 50);
  };

  // Render slide content block (reusable for both full and split layouts)
  const renderSlideContent = (item, index) => {
    const buttonUrl = item.button?.url || '';
    const buttonTitle = item.button?.title || '';
    const buttonTarget = item.button?.target || '_self';

    return (
      <div
        className={`max-w-4xl transition-all duration-700 ease-out ${
          isAnimating && activeIndex === index
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-8'
        }`}
      >
        {item.title && (
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl 3xl:text-6xl font-extrabold uppercase leading-tight mb-4 md:mb-6"
            style={{ color: titleColor }}
          >
            {item.title}
          </h2>
        )}

        {item.desc && (
          <p
            className="text-base sm:text-lg md:text-l xl:text-xl font-medium leading-relaxed mb-6 md:mb-10"
            style={{ color: descColor }}
          >
            {item.desc}
          </p>
        )}

        {buttonTitle && buttonUrl && (
          <div>
            {buttonTarget === '_blank' ? (
              <a
                href={buttonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block py-4 px-8 md:py-5 md:px-10 rounded-md text-lg md:text-xl bg-accent uppercase font-extrabold hover:bg-white text-white hover:text-accent transition-colors duration-300 border border-accent"
              >
                {buttonTitle}
              </a>
            ) : (
              <Link
                href={buttonUrl}
                className="inline-block py-4 px-8 md:py-5 md:px-10 rounded-md text-lg md:text-xl bg-accent uppercase font-extrabold hover:bg-white text-white hover:text-accent transition-colors duration-300 border border-accent"
              >
                {buttonTitle}
              </Link>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <section
      className="hero-slider relative w-full overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      <Swiper
        ref={swiperRef}
        modules={[Autoplay, Navigation, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        spaceBetween={0}
        slidesPerView={1}
        loop={slider_items.length > 1}
        speed={800}
        autoplay={autoPlay ? {
          delay: autoplayDelay,
          disableOnInteraction: false,
        } : false}
        navigation={showArrows ? {
          nextEl: `.${nextClass}`,
          prevEl: `.${prevClass}`,
        } : false}
        pagination={showDots ? {
          el: `.${paginationClass}`,
          clickable: true,
          bulletClass: 'hero-slider-bullet',
          bulletActiveClass: 'hero-slider-bullet-active',
        } : false}
        onSlideChange={handleSlideChange}
        className="w-full h-screen min-h-[500px] max-h-[900px] md:max-h-[100vh]"
      >
        {slider_items.map((item, index) => {
          const imageUrl = item.image && typeof item.image === 'object' ? getImageUrl(item.image) : null;
          const imageAlt = item.image && typeof item.image === 'object' ? getImageAlt(item.image, item.title || 'Hero slide') : (item.title || 'Hero slide');

          return (
            <SwiperSlide key={index}>
              {/* Full Width Image Layout */}
              {isFullImage && (
                <div className="relative w-full h-screen min-h-[500px] max-h-[900px] md:max-h-[100vh]">
                  {imageUrl && (
                    <Image
                      src={imageUrl}
                      alt={imageAlt}
                      fill
                      className="object-cover"
                      sizes="100vw"
                      quality={100}
                      priority={index === 0}
                    />
                  )}

                  {overlayColor && (
                    <div
                      className="absolute inset-0 z-10"
                      style={{ backgroundColor: overlayColor }}
                    />
                  )}

                  <div className={`relative z-20 flex flex-col h-full px-8 md:px-12 lg:px-20 xl:px-28 py-20 md:py-28 ${contentPositionClass}`}>
                    {renderSlideContent(item, index)}
                  </div>
                </div>
              )}

              {/* Split Layout: Image Left / Content Right */}
              {imgPosition === 'left' && (
                <div className="relative w-full h-screen min-h-[500px] max-h-[900px] md:max-h-[100vh] flex flex-col md:flex-row">
                  <div className="absolute inset-0 w-full h-full md:relative md:w-1/2 md:h-full z-0 md:z-auto">
                    {imageUrl && (
                      <Image
                        src={imageUrl}
                        alt={imageAlt}
                        fill
                        className="object-cover"
                        sizes="100vw"
                        quality={100}
                        priority={index === 0}
                      />
                    )}
                    {overlayColor && (
                      <div
                        className="absolute inset-0 z-10"
                        style={{ backgroundColor: overlayColor }}
                      />
                    )}
                  </div>
                  <div className="relative md:mr-6 z-20 w-full h-full md:w-1/2 md:h-full flex flex-col items-center justify-center text-center md:items-start md:justify-center md:text-left px-8 md:px-12 lg:px-16 xl:px-20 py-20 md:py-20">
                    {renderSlideContent(item, index)}
                  </div>
                </div>
              )}

              {/* Split Layout: Content Left / Image Right */}
              {imgPosition === 'right' && (
                <div className="relative md:ml-6 w-full h-screen min-h-[500px] max-h-[900px] md:max-h-[100vh] flex flex-col-reverse md:flex-row">
                  <div className="relative z-20 w-full h-full md:w-1/2 md:h-full flex flex-col items-center justify-center text-center md:items-start md:justify-center md:text-left px-8 md:px-12 lg:px-16 xl:px-20 py-20 md:py-20">
                    {renderSlideContent(item, index)}
                  </div>
                  <div className="absolute inset-0 w-full h-full md:relative md:w-1/2 md:h-full z-0 md:z-auto">
                    {imageUrl && (
                      <Image
                        src={imageUrl}
                        alt={imageAlt}
                        fill
                        className="object-cover"
                        sizes="100vw"
                        quality={100}
                        priority={index === 0}
                      />
                    )}
                    {overlayColor && (
                      <div
                        className="absolute inset-0 z-10"
                        style={{ backgroundColor: overlayColor }}
                      />
                    )}
                  </div>
                </div>
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Navigation Arrows */}
      {showArrows && slider_items.length > 1 && (
        <>
          <button
            className={`${prevClass} absolute left-0 lg:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 xl:w-12 xl:h-12 flex items-center justify-center text-white hover:text-accent transition-colors duration-300 rotate-180`}
            aria-label="Previous slide"
          >
            <ArrowIcon className="w-6 h-6 lg:w-8 lg:h-8" />
          </button>
          <button
            className={`${nextClass} absolute right-0 lg:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 xl:w-12 xl:h-12 flex items-center justify-center text-white hover:text-accent transition-colors duration-300`}
            aria-label="Next slide"
          >
            <ArrowIcon className="w-6 h-6 lg:w-8 lg:h-8" />
          </button>
        </>
      )}

      {/* Pagination Dots */}
      {showDots && slider_items.length > 1 && (
        <div className={`${paginationClass} hero-slider-pagination absolute bottom-6 md:bottom-10 left-0 right-0 z-30 flex items-center justify-center gap-3`} />
      )}
    </section>
  );
};

export default HeroSlider;
