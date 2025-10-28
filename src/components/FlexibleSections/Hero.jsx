import React from 'react';
import BounceArrow from '../common/BounceArrow'

const HeroSection = ({ data }) => {

  const backgroundColor = data.hero_bg_color ? '[' + data.hero_bg_color + ']' : '[#0051bc]';
  const imageUrl = data.hero_bg_image.url ? data.hero_bg_image.url : null;
  const height = data.hero_section_height && data.hero_section_height > 0 ? data.hero_section_height + 'vh' : 'auto';
  const isShowBounceArrow = data.hero_bounce_arrow ? data.hero_bounce_arrow : false;  

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
        {/* Desktop video */}
        {videoUrl && (
          <video
            className="hidden sm:block w-full h-full object-cover"
            autoPlay loop muted playsInline
            poster={imageUrl || undefined}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          >
            <source src={videoUrl} type="video/mp4" /> {/* Optionally add webm/ogg sources */}
          </video>
        )}
        {/* Mobile video */}
        {videoUrlMobile && (
          <video
            className="block sm:hidden w-full h-full object-cover"
            autoPlay loop muted playsInline
            poster={imageUrl || undefined}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          >
            <source src={videoUrlMobile} type="video/mp4" />
          </video>
        )}
        {/* Fallback: If only one video, show on all screens */}
        {!videoUrl && videoUrlMobile && (
          <video
            className="w-full h-full object-cover"
            autoPlay loop muted playsInline
            poster={imageUrl || undefined}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          >
            <source src={videoUrlMobile} type="video/mp4" />
          </video>
        )}
        {!videoUrlMobile && videoUrl && (
          <video
            className="w-full h-full object-cover"
            autoPlay loop muted playsInline
            poster={imageUrl || undefined}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        )}
      </div>
    );
  };

  // Compose background style for fallback image if no video
  const sectionStyle = (!videoUrl && !videoUrlMobile && imageUrl)
    ? {
        backgroundImage: `url('${imageUrl}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: `${height}`
      }
    : {
      height: `${height}`
    };

  const isNoOverlay = !videoUrl && !videoUrlMobile && !imageUrl;
  const overlayOpacity = data.hero_bg_overlay_opacity && data.hero_bg_overlay_opacity > 0 ? data.hero_bg_overlay_opacity / 100 : 0;
  const overlayColor = data.hero_bg_overlay_color ? data.hero_bg_overlay_color : '#000000';
  const overlayStyle = {
    backgroundColor: overlayColor,
    opacity: overlayOpacity
  };

  return (
    <section
      className={`relative flex text-white section-padding bg-${backgroundColor} overflow-hidden`}
      style={sectionStyle}
    >
      {/* Video background if present */}
      {renderVideoBackground()}

      {/* Overlay for darkening video/image if needed */}
      { !isNoOverlay && (
        <div className="absolute inset-0 z-10 pointer-events-none" aria-hidden="true" style={overlayStyle}></div>
      ) }

      <div className="container relative z-20">
        <div className={`grid grid-cols-1 gap-12 items-center ${alignClass}`}>
          <div className={`fade-in ${textAlignClass}`}>
            {data.hero_title && (
              <h1 className="text-4xl md:text-5xl 2xl:text-6xl font-extrabold">
                { !isNoOverlay ? (
                  <span className="inline-block py-6 px-6 md:py-10 md:px-14 bg-primary rounded-md shimmer">
                    {data.hero_title}
                  </span>
                ) : (
                  <span>{data.hero_title}</span>
                ) }
              </h1>
            )}
            {data.hero_sub_title && (
              <p className="text-base sm:text-lg md:text-2xl lg:text-3xl font-medium md:font-bold mt-3 md:mt-6">
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
      { isShowBounceArrow && (
        <BounceArrow/>
      )}
    </section>
  );
};

export default HeroSection;