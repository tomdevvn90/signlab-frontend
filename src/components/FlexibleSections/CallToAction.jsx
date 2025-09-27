import React from 'react';
import Image from 'next/image';

const CallToActionSection = ({ data }) =>{
  const backgroundColor = data.cta_background_color ? '[' + data.cta_background_color + ']' : 'white';
  
  return (
    <section className="section-padding bg-[#81d742]">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="fade-in">
            {data.cta_title && (
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                {data.cta_title}
              </h2>
            )}
            {data.cta_description && (
              <div 
                className="wp-content text-gray-700"
                dangerouslySetInnerHTML={{ __html: data.cta_description }}
              />
            )}

            {data.cta_button_text && data.cta_button_url && (
                <a href={data.cta_button_url} className="btn-primary">
                  {data.cta_button_text}
                </a>
              )
            }
          </div>
        </div>
      </div>
    </section>
  );
}

export default CallToActionSection;