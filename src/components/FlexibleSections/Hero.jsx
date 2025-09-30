import React from 'react';
import { getImageUrl } from "../../lib/utils";

const HeroSection = ({ data }) => {
  console.log(data);

  const backgroundColor = data.hero_bg_color ? '[' + data.hero_bg_color + ']' : '';

  const imageData = data.hero_bg_image && typeof data.hero_bg_image === 'object' ? data.hero_bg_image : null;
  const imageUrl = getImageUrl(imageData, 'full');

  // Compose background style
  const backgroundImageStyle = imageUrl
    ? {
        backgroundImage: `url('${imageUrl}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }
    : {};

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

  return (
    <section
      className={`bg-gradient-to-r flex from-blue-600 to-blue-800 text-white section-padding min-h-[800px] bg-${backgroundColor}`}
      style={backgroundImageStyle}
    >
      <div className="container">
        <div className={`grid grid-cols-1 gap-12 items-center ${alignClass}`}>
          <div className={`fade-in ${textAlignClass}`}>
            {data.hero_title && (
              <h1 className="text-5xl font-black mb-6">
                <span className="inline-block p-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded-md">
                  {data.hero_title}
                </span>
              </h1>
            )}
            {data.hero_sub_title && (
              <p className="text-2xl mb-8 font-bold">
                {data.hero_sub_title}
              </p>
            )}
            {data.hero_button_text && data.hero_button_url && (
              <a
                href={data.hero_button_url}
                className="btn-primary"
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