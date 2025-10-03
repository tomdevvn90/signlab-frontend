import React from 'react';
import Image from 'next/image';

const ContentWithImage = ({ data }) => {
  if (!data) return null;    

  // Get color scheme based on data.color_scheme
  const colorScheme = data.color_scheme === 'dark' ? data.color_scheme_dark : data.color_scheme_light;

  const imageData = data.image;
  
  // Parse content to handle line breaks
  const parseContent = (content) => {
    if (!content) return [];
    return content.split('\r\n\r\n').filter(paragraph => paragraph.trim() !== '');
  };

  const paragraphs = parseContent(data.content);

  // Determine layout classes based on content_align (using flex layout)
  const getLayoutClasses = (align) => {
    switch (align?.toLowerCase()) {
      case 'right':
        return {
          container: 'flex flex-col lg:flex-row-reverse gap-8 lg:gap-12 items-end',
          content: 'w-full lg:w-2/5',
          image: 'w-full lg:w-3/5'
        };
      case 'left':
      default:
        return {
          container: 'flex flex-col lg:flex-row gap-8 lg:gap-12 items-end',
          content: 'w-full lg:w-2/5',
          image: 'w-full lg:w-3/5'
        };
    }
  };

  const layoutClasses = getLayoutClasses(data.content_align);

  // Apply color scheme styles
  const sectionStyle = {
    backgroundColor: colorScheme?.background_color || '#ffffff',
    color: colorScheme?.text_color || '#727272'
  };

  const headingStyle = {
    color: colorScheme?.heading_color || '#0051bc'
  };

  return (
    <section 
      className=""
      style={sectionStyle}
    >
      <div className="container">
        <div className={layoutClasses.container}>
          
          {/* Content Column */}
          <div className={`fade-in ${layoutClasses.content} py-60`}>
            {data.title && (
              <div className="">
                <h2 
                  className="text-4xl lg:text-5xl font-bold mb-10"
                  style={headingStyle}
                >
                  {data.title}
                </h2>
                {/* Decorative line */}
                <div className="w-[150px] h-2 bg-secondary mb-10"></div>
              </div>
            )}
            
            {/* Content paragraphs */}
            <div className="space-y-6">
              {paragraphs.map((paragraph, index) => (
                <p 
                  key={index} 
                  className="text-lg leading-relaxed"
                  style={{ color: colorScheme?.text_color || '#727272' }}
                >
                  {paragraph.trim()}
                </p>
              ))}
            </div>

            {/* Button */}
            {data.button_text && data.button_url && (
              <div className="mt-10">
                <a
                  href={data.button_url}
                  className="btn-primary"
                  style={{
                    backgroundColor: colorScheme?.heading_color || '#0051bc',
                    color: colorScheme?.background_color || '#ffffff',
                    borderColor: colorScheme?.heading_color || '#0051bc'
                  }}
                >
                  {data.button_text}
                </a>
              </div>
            )}
          </div>

          {/* Image Column */}
          {imageData && (
            <div className={`pt-20 slide-in-right ${layoutClasses.image} h-full`}>
              <div className="relative flex align-bottom h-full">
                <Image
                  src={imageData.url}
                  alt={imageData.alt}
                  width={800}
                  height={600}
                  className="object-contain object-bottom w-full h-auto"
                  priority={false}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContentWithImage;
