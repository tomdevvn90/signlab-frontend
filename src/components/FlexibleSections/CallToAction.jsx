'use client';

import React, { useEffect, useRef, useState } from 'react';

const CallToActionSection = ({ data }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

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

  // Intersection Observer for fade-in animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -200px 0px'
      }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

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
      ref={sectionRef}
      className="py-24 lg:py-40"
      style={{
        backgroundColor: backgroundColor,
        color: textColor,
      }}
    >
      <div className="container">
        <div className={`flex flex-col transition-all duration-1000 ease-out ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-12'
        } ${contentAlignClass}`}>
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
    </section>
  );
};

export default CallToActionSection;