'use client';

import React from 'react';
import Image from 'next/image';

const SingleColumnContent = ({ data }) => {
  // Early return if no data
  if (!data) return null;

  const { image, title, sub_title, content, image_position, content_align, padding_top, padding_bottom } = data;

  // Early return if no title or content
  if (!title?.text && !content && !image) {
    return null;
  }

  // Determine text alignment class
  const titleAlignClass = content_align === 'left' ? 'text-left' : content_align === 'right' ? 'text-right' : 'text-center';

  const dividerAlignClass = content_align === 'left' ? 'ml-0' : content_align === 'right' ? 'mr-0' : 'mx-auto';

  // Function to render the content with proper HTML parsing
  const renderContent = () => {
    if (!content) return null;
    // Replace all line breaks with <br />
    const safeHTML = content.replace(/(?<!>)\r?\n(?!<)/g, '<br />');
    // Determine text alignment class
    const alignClass = content_align === 'left' ? 'text-left' : 
                      content_align === 'right' ? 'text-right' : 'text-center';
    return (
      <div 
        className={`wp-content max-w-4xl ${alignClass === 'text-center' ? 'mx-auto' : ''} ${alignClass}`}
        dangerouslySetInnerHTML={{ __html: safeHTML }}
      />
    );
  };

  // Determine padding classes based on options
  const getPaddingClasses = () => {
    let paddingClasses = '';
    if (padding_top === true) {
      paddingClasses += 'pt-20 lg:pt-40 ';
    }
    if (padding_bottom === true) {
      paddingClasses += 'pb-20 lg:pb-40 ';
    }
    return paddingClasses;
  };

  // Determine layout classes based on image_position
  const getLayoutClasses = (position) => {
    switch (position?.toLowerCase()) {
      case 'left':
        return {
          container: 'flex flex-col lg:flex-row gap-12 lg:gap-20',
          image: 'w-full order-2 lg:order-1',
          content: 'w-full order-1 lg:order-2'
        };
      case 'right':
        return {
          container: 'flex flex-col lg:flex-row gap-12 lg:gap-20',
          image: 'w-full order-2',
          content: 'w-full order-1'
        };
      case 'top':
        return {
          container: 'flex flex-col gap-12 lg:gap-20',
          image: 'w-full',
          content: 'w-full'
        };
      case 'bottom':
        return {
          container: 'flex flex-col gap-12 lg:gap-20',
          image: 'w-full order-2',
          content: 'w-full order-1'
        };
      default:
        return {
          container: 'flex flex-col',
          image: 'w-full',
          content: 'w-full'
        };
    }
  };

  const layoutClasses = getLayoutClasses(image_position);

  return (
    <section className={`${getPaddingClasses()}bg-white single-column-content-section`}>
      <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
        <div className={` mx-auto`}>
          {/* Layout Container for Image + Content */}
          <div className={layoutClasses.container}>
            {/* Image Section */}
            {image && (
              <div className={`${layoutClasses.image}`}>
                <Image
                  src={image.url}
                  alt={image.alt || title?.text || 'Image'}
                  width={1024}
                  height={1024}
                  sizes="100vw"
                  className="object-cover w-full h-full max-h-[400px] lg:max-h-none"
                  priority={false}
                />
              </div>
            )}

            {/* Content Section */}
            <div className={`mx-auto content-center max-w-5xl ${layoutClasses.content}`}>
              {/* Sub Title */}
              {sub_title?.text && (
                <p className={`sub-title block relative text-3xl lg:text-4xl xl:text-5xl font-300 mb-6 lg:mb-10 text-primary uppercase ${titleAlignClass}`}>
                  {sub_title.text}
                </p>
              )}

              {/* Title */}
              {title?.text && (
                <h2 className={`title text-4xl lg:text-5xl xl:text-6xl font-bold mb-8 lg:mb-10 text-primary uppercase ${titleAlignClass}`}>
                  {title.text}
                </h2>
              )}

              {/* Divider */}
              {content && (
                <div className={`block w-[150px] h-2 bg-secondary my-6 lg:my-12 ${dividerAlignClass}`}></div>
              )}
              
              {/* Content */}
              <div className="mt-8 lg:mt-12">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SingleColumnContent;
