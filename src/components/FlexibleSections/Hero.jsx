"use client";

import React from 'react';
import BounceArrow from '../common/BounceArrow';
import { getImageUrl } from '../../lib/utils';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';

const HeroSection = ({ data }) => {

  const backgroundColor = data.hero_bg_color ? data.hero_bg_color : '#0051bc';
  const imageUrl = getImageUrl(data.hero_bg_image);
  const imageUrlMobile = getImageUrl(data.hero_bg_img_mobile) || imageUrl;

  const aspectRatio = data.hero_bg_image?.width && data.hero_bg_image?.height 
    ? `${data.hero_bg_image.width} / ${data.hero_bg_image.height}` 
    : 'auto';
  const aspectRatioMobile = data.hero_bg_img_mobile?.width && data.hero_bg_img_mobile?.height 
    ? `${data.hero_bg_img_mobile.width} / ${data.hero_bg_img_mobile.height}` 
    : aspectRatio;

  // Use dvh (dynamic viewport height) to perfectly fit the screen on mobile devices with bottom bars
  const height = data.hero_section_height && data.hero_section_height > 0 ? data.hero_section_height + 'dvh' : 'auto';
  const isShowBounceArrow = data.hero_bounce_arrow ? data.hero_bounce_arrow : false;
  let paddingTopValue = data.hero_padding_top ? data.hero_padding_top : null;
  let paddingBottomValue = data.hero_padding_bottom ? data.hero_padding_bottom : null;
  const textColor = data.hero_text_color ? data.hero_text_color : '#ffffff';  

  if (paddingTopValue == null) {
    paddingTopValue = 200;
  }

  if (paddingBottomValue == null) {
    paddingBottomValue = 200;
  }

  // Video background URLs
  const videoUrl = data.hero_bg_video_url || null;
  const videoUrlMobile = data.hero_bg_video_url_mobile || null;

  // Determine alignment classes based on data.hero_content_align
  let alignClass = '';
  let textAlignClass = '';
  switch ((data.hero_content_align || 'center').toLowerCase()) {
    case 'left':
      alignClass = 'justify-start';
      textAlignClass = 'text-left';
      break;
    case 'right':
      alignClass = 'justify-end';
      textAlignClass = 'text-right';
      break;
    case 'center':
    default:
      alignClass = 'justify-center';
      textAlignClass = 'text-center';
      break;
  }

  // Helper: Render video background if videoUrl exists
  // Uses poster from imageUrl if available
  const renderVideoBackground = () => {
    if (!videoUrl && !videoUrlMobile) return null;
    return (
      <div
        className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        {/* Desktop video or fallback for mobile */}
        {videoUrl && (
          <video
            className={`w-full h-full object-cover ${videoUrlMobile ? 'hidden md:block' : ''}`}
            autoPlay loop muted playsInline
            poster={imageUrl || undefined}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        )}
        {/* Mobile-only video */}
        {videoUrlMobile && (
          <video
            className="block md:hidden w-full h-full object-cover"
            autoPlay loop muted playsInline
            poster={imageUrlMobile || imageUrl || undefined}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          >
            <source src={videoUrlMobile} type="video/mp4" />
          </video>
        )}
      </div>
    );
  };

  // Compose background style for fallback image if no video
  // Uses CSS calc() with --hero-padding-scale for responsive padding
  const sectionStyle = {
    '--hero-bg-image': imageUrl ? `url('${imageUrl}')` : 'none',
    '--hero-bg-image-mobile': imageUrlMobile ? `url('${imageUrlMobile}')` : (imageUrl ? `url('${imageUrl}')` : 'none'),
    '--hero-aspect-ratio': height === 'auto' ? aspectRatio : 'auto',
    '--hero-aspect-ratio-mobile': height === 'auto' ? aspectRatioMobile : 'auto',
    backgroundColor: backgroundColor,
    height: `${height}`,
    paddingTop: `calc(${paddingTopValue}px * var(--hero-padding-scale, 1))`,
    paddingBottom: `calc(${paddingBottomValue}px * var(--hero-padding-scale, 1))`
  };

  const hasBackground = videoUrl || videoUrlMobile || imageUrl || imageUrlMobile;
  const isNoOverlay = !hasBackground;
  
  const overlayOpacity = data.hero_bg_overlay_opacity && data.hero_bg_overlay_opacity > 0 ? data.hero_bg_overlay_opacity / 100 : 0;
  const overlayColor = data.hero_bg_overlay_color ? data.hero_bg_overlay_color : '#000000';
  const overlayStyle = {
    backgroundColor: overlayColor,
    opacity: overlayOpacity
  };

  const isSlider = data.layout_type === 'slider';

  return (
    <section
      className={`hero-section relative flex text-white overflow-hidden ${isSlider ? 'hero-slider-active' : ''}`}
      style={sectionStyle}
    >
      {/* Global Background (Video/Image) */}
      {renderVideoBackground()}

      {/* Static Layout Overlay - Only if not a slider */}
      {!isSlider && !isNoOverlay && (
        <div className="absolute inset-0 z-10 pointer-events-none" aria-hidden="true" style={overlayStyle}></div>
      )}

      <div className="relative z-20 flex flex-col justify-center w-full h-full">
        {isSlider && data.hero_slider && data.hero_slider.length > 0 ? (
          <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectFade]}
            navigation={data.nav_arrow}
            pagination={data.dots ? { clickable: true } : false}
            autoplay={data.auto_play ? {
              delay: (data.auto_play_per_second || 3) * 1000,
              disableOnInteraction: false,
            } : false}
            effect="fade"
            loop={true}
            className="w-full h-full hero-swiper"
          >
            {data.hero_slider.map((slide, index) => {
              const slideBg = getImageUrl(slide.slide_bg_img);
              const slideBgMobile = getImageUrl(slide.slide_bg_img_mobile) || slideBg;
              const hasSlideBg = slideBg || slideBgMobile;

              return (
                <SwiperSlide key={index} className="h-full relative overflow-hidden flex flex-col justify-center">
                  {/* Individual Slide Backgrounds */}
                  {slideBg && (
                    <div 
                      className="absolute inset-0 pointer-events-none z-0 hidden md:block"
                      style={{
                        backgroundImage: `url(${slideBg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />
                  )}
                  {slideBgMobile && (
                    <div 
                      className="absolute inset-0 pointer-events-none z-0 block md:hidden"
                      style={{
                        backgroundImage: `url(${slideBgMobile})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />
                  )}
                  
                  {/* Slide Overlay - Applies to both slideBg and global section background */}
                  {(hasSlideBg || !isNoOverlay) && (
                    <div className="absolute inset-0 z-[1] pointer-events-none" aria-hidden="true" style={overlayStyle}></div>
                  )}
                  
                  <div className="container relative z-10">
                    <div className={`grid grid-cols-1 gap-12 items-center ${alignClass} py-12 px-6 md:px-10 md:py-20`}>
                      <div className={`fade-in ${textAlignClass}`}>
                        {slide.slide_title && (
                          <h2 className={`text-4xl md:text-5xl 2xl:text-6xl font-extrabold mb-4 slide-title`} style={{ color: textColor }}>
                            {!isNoOverlay || hasSlideBg ? (
                              <span className="inline-block py-4 px-6 md:py-6 md:px-10 bg-primary rounded-md shimmer leading-tight">
                                {slide.slide_title}
                              </span>
                            ) : (
                              <span>{slide.slide_title}</span>
                            )}
                          </h2>
                        )}
                        {slide.slide_desc && (
                          <div 
                            className={`text-base sm:text-lg md:text-2xl lg:text-3xl font-medium md:font-bold mt-3 md:mt-6 slide-desc`} 
                            style={{ color: textColor }}
                            dangerouslySetInnerHTML={{ __html: slide.slide_desc }}
                          />
                        )}
                        {slide.slide_button && slide.slide_button.url && (
                          <a
                            href={slide.slide_button.url}
                            target={slide.slide_button.target}
                            className="mt-6 md:mt-10 py-4 px-7 md:py-6 md:px-9 rounded-md text-xl md:text-2xl bg-accent uppercase font-extrabold inline-block hover:bg-white hover:text-accent text-center transition-colors duration-300 border-accent border slide-button"
                          >
                            {slide.slide_button.title || 'Learn More'}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        ) : (
          /* Static Layout */
          <div className="container">
            <div className={`grid grid-cols-1 gap-12 items-center ${alignClass}`}>
              <div className={`fade-in ${textAlignClass}`}>
                {data.hero_title && (
                  <h1 className={`text-4xl md:text-5xl 2xl:text-6xl font-extrabold`} style={{ color: textColor }}>
                    {!isNoOverlay ? (
                      <span className="inline-block py-6 px-6 md:py-10 md:px-14 bg-primary rounded-md shimmer">
                        {data.hero_title}
                      </span>
                    ) : (
                      <span>{data.hero_title}</span>
                    )}
                  </h1>
                )}
                {data.hero_sub_title && (
                  <p className={`text-base sm:text-lg md:text-2xl lg:text-3xl font-medium md:font-bold mt-3 md:mt-6`} style={{ color: textColor }}>
                    {data.hero_sub_title}
                  </p>
                )}
                {data.hero_button_text && data.hero_button_url && (
                  <a
                    href={data.hero_button_url}
                    className="mt-6 md:mt-10 py-4 px-7 md:py-6 md:px-9 rounded-md text-xl md:text-2xl bg-accent uppercase font-extrabold inline-block hover:bg-white hover:text-accent text-center transition-colors duration-300 border-accent border"
                  >
                    {data.hero_button_text}
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {isShowBounceArrow && (
        <BounceArrow className={data.hero_section_height < 100 || !data.hero_section_height ? 'max-md:!bottom-12' : ''} />
      )}
    </section>
  );
};

export default HeroSection;