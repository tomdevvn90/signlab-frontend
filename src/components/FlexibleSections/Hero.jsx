import React from 'react';

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
        <div className="bounce-arrow w-16 h-16 md:w-20 md:h-20 xl:w-24 xl:h-24 absolute left-1/2 bottom-24 md:bottom-12 -translate-x-1/2 z-50 bounce">
          <svg filter="drop-shadow(0 0 4px rgba(0, 0, 0, 0.4))" fill="#ffffff" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M128,28A100,100,0,1,0,228,128,100.11332,100.11332,0,0,0,128,28Zm0,192a92,92,0,1,1,92-92A92.10416,92.10416,0,0,1,128,220Zm36.76953-88.76953a4,4,0,0,1,0,5.65674l-33.94141,33.9414a3.99971,3.99971,0,0,1-5.65625,0l-33.9414-33.9414a3.99992,3.99992,0,0,1,5.65674-5.65674L124,158.34326V88a4,4,0,0,1,8,0v70.34326l27.11279-27.11279A4,4,0,0,1,164.76953,131.23047Z"></path> </g></svg>
        </div>
      )}
    </section>
  );
};

export default HeroSection;