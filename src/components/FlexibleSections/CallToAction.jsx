import React from 'react';
import Image from 'next/image';

const CallToActionSection = ({ data }) => {
  const backgroundColor = data.cta_bg_color ? data.cta_bg_color : 'white';

  // Determine content alignment class
  let contentAlignClass = '';
  switch (data.cta_content_align) {
    case 'center':
      contentAlignClass = 'text-center items-center justify-center';
      break;
    case 'right':
      contentAlignClass = 'text-right items-end justify-end';
      break;
    case 'left':
    default:
      contentAlignClass = 'text-left items-start justify-start';
      break;
  }

  return (
    <section className={`section-padding`} style={{ backgroundColor: backgroundColor }}>
      <div className="container">
        <div className="grid grid-cols-1 gap-12 items-center">
          <div className={`fade-in flex flex-col ${contentAlignClass}`}>
            {data.cta_title && (
              <h2 className="text-5xl font-bold mb-10">
                {data.cta_title}
              </h2>
            )}
            {data.cta_description && (
              <div
                className="wp-content text-gray-700 text-2xl mb-10"
                dangerouslySetInnerHTML={{ __html: data.cta_description }}
              />
            )}
            {data.cta_button_text && data.cta_button_url && (
              <a href={data.cta_button_url} className="btn-primary">
                {data.cta_button_text}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CallToActionSection;