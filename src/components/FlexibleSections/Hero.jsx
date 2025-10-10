import React from 'react';

const HeroSection = ({ data }) => {
  const backgroundColor = data.hero_bg_color ? '[' + data.hero_bg_color + ']' : '';
  const imageUrl = data.hero_bg_image.url ? data.hero_bg_image.url : null;

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
            autoPlay
            loop
            muted
            playsInline
            poster={imageUrl || undefined}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          >
            <source src={videoUrl} type="video/mp4" />
            {/* Optionally add webm/ogg sources */}
          </video>
        )}
        {/* Mobile video */}
        {videoUrlMobile && (
          <video
            className="block sm:hidden w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
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
            autoPlay
            loop
            muted
            playsInline
            poster={imageUrl || undefined}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          >
            <source src={videoUrlMobile} type="video/mp4" />
          </video>
        )}
        {!videoUrlMobile && videoUrl && (
          <video
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
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
  const backgroundImageStyle = (!videoUrl && !videoUrlMobile && imageUrl)
    ? {
        backgroundImage: `url('${imageUrl}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }
    : {};

  return (
    <section
      className={`relative bg-gradient-to-r flex from-blue-600 to-blue-800 text-white section-padding h-[100vh] bg-${backgroundColor} overflow-hidden`}
      style={backgroundImageStyle}
    >
      {/* Video background if present */}
      {renderVideoBackground()}
      {/* Overlay for darkening video/image if needed */}
      <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" aria-hidden="true"></div>
      <div className="container relative z-20">
        <div className={`grid grid-cols-1 gap-12 items-center ${alignClass}`}>
          <div className={`fade-in ${textAlignClass}`}>
            {data.hero_title && (
              <h1 className="2xl:text-6xl lg:text-5xl text-4xl font-extrabold mb-12">
                <span className="inline-block py-6 px-6 md:py-10 md:px-14 bg-[#0051bc] rounded-md">
                  {data.hero_title}
                </span>
              </h1>
            )}
            {data.hero_sub_title && (
              <p className="text-2xl md:text-3xl mb-12 font-extrabold">
                {data.hero_sub_title}
              </p>
            )}
            {data.hero_button_text && data.hero_button_url && (
              <a
                href={data.hero_button_url}
                className="py-4 px-7 md:py-6 md:px-9 rounded-md text-xl md:text-2xl bg-accent uppercase font-extrabold inline-block hover:bg-white hover:text-accent text-center transition-colors duration-300 border-accent border"
              >
                {data.hero_button_text}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;