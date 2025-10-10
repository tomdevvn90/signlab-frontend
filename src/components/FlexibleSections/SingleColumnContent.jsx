'use client';

import React from 'react';

const SingleColumnContent = ({ data }) => {
  // Early return if no data
  if (!data) return null;

  const { title, content } = data;

  // Early return if no title or content
  if (!title?.text && !content) {
    return null;
  }

  // Function to render the title with proper heading tag
  const renderTitle = () => {
    if (!title?.text) return null;
    
    const HeadingTag = title.heading || 'h1';
    
    return (
      <HeadingTag 
        className="text-4xl lg:text-5xl xl:text-6xl font-extrabold text-center mb-4"
        style={{ color: 'var(--primary-color)' }}
      >
        {title.text}
      </HeadingTag>
    );
  };

  // Function to render the content with proper HTML parsing
  const renderContent = () => {
    if (!content) return null;
    
    return (
      <div 
        className="wp-content max-w-4xl mx-auto"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  };

  return (
    <section className="py-16 lg:py-24 bg-white single-column-content-section">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-6xl mx-auto">
          {/* Title */}
          {renderTitle()}
          
          {/* Content */}
          <div className="mt-16">
            {renderContent()}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SingleColumnContent;
