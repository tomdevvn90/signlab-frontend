'use client';

import React from 'react';

const SingleColumnContent = ({ data }) => {
  // Early return if no data
  if (!data) return null;

  const { title, sub_title, content, content_align, padding_top, padding_bottom } = data;

  // Early return if no title or content
  if (!title?.text && !content) {
    return null;
  }

  // Function to render the title with proper heading tag
  const renderTitle = () => {
    if (!title?.text && !sub_title?.text) return null;
    
    const HeadingTag = title.heading || 'h1';
    const SubHeadingTag = sub_title.heading || 'h2';
    
    // Determine text alignment class
    const alignClass = content_align === 'left' ? 'text-left' : 
                      content_align === 'right' ? 'text-right' : 'text-center';
    
    return (
      <>
        {title?.text && (
          <HeadingTag 
            className={`title text-4xl lg:text-6xl xl:text-7xl font-extrabold mb-6 sm:mb-10 lg:mb-12 text-primary uppercase ${alignClass}`}
          >
            {title.text}
          </HeadingTag>
        )}
        {sub_title?.text && (
          <SubHeadingTag 
            className={`sub-title block relative text-3xl lg:text-5xl xl:text-6xl font-bold mb-6 sm:mb-10 lg:mb-12 text-primary uppercase ${alignClass}`}
          >
            {sub_title.text}
          </SubHeadingTag>
        )}
      </>
    );
  };

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
    
    // If neither is true, use default padding
    if (padding_top !== true && padding_bottom !== true) {
      paddingClasses = 'py-20 lg:py-40 ';
    }
    
    return paddingClasses;
  };

  // Determine container alignment class
  const containerAlignClass = content_align === 'left' ? 'text-left' : 
                              content_align === 'right' ? 'text-right' : 'text-center';

  return (
    <section className={`${getPaddingClasses()}bg-white single-column-content-section`}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className={`max-w-6xl mx-auto ${containerAlignClass}`}>
          {/* Title */}
          {renderTitle()}
          
          {/* Content */}
          <div className="mt-10 lg:mt-12">
            {renderContent()}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SingleColumnContent;
