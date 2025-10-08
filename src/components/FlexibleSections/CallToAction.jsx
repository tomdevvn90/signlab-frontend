import React from 'react';

const CallToActionSection = ({ data }) => {
  // Determine which color scheme to use
  const colorScheme = data.color_scheme === 'dark' ? data.color_scheme_dark : data.color_scheme_light;
  
  // Fallbacks in case colorScheme is missing
  const backgroundColor =
    (colorScheme && colorScheme.background_color) ||
    data.cta_bg_color ||
    '#ffffff';
  const headingColor =
    (colorScheme && colorScheme.heading_color) || '#0051bc';
  const textColor =
    (colorScheme && colorScheme.text_color) || '#727272';
  const buttonColor =
    (colorScheme && colorScheme.button_color) || '#0051bc';

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
    <section
      className="py-24 lg:py-40"
      style={{
        backgroundColor: backgroundColor,
        color: textColor,
      }}
    >
      <div className="container">
        <div className="grid grid-cols-1 gap-12 items-center">
          <div className={`fade-in flex flex-col ${contentAlignClass}`}>
            {data.cta_title && (
              <h2
                className="text-4xl xl:text-5xl 2xl:text-6xl font-extrabold mb-10"
                style={{ color: headingColor }}
              >
                {data.cta_title}
              </h2>
            )}
            {data.cta_description && (
              <div
                className="wp-content text-lg mb-10 max-w-[1000px]"
                style={{ color: textColor }}
                dangerouslySetInnerHTML={{ __html: data.cta_description }}
              />
            )}
            {data.cta_button_text && data.cta_button_url && (
              <a
                href={data.cta_button_url}
                className={`btn-primary uppercase text-white hover:text-[#0051bc] hover:!bg-white`}
                style={{
                  backgroundColor: buttonColor,
                  borderColor: buttonColor,
                  transition: 'background-color 0.3s, color 0.3s',
                }}
              >
                {data.cta_button_text}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;