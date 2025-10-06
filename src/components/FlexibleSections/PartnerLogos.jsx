import React from 'react';
import Image from 'next/image';
import { getImageUrl, getImageAlt } from '../../lib/utils';

const PartnerLogos = ({ data }) => {
  if (!data) return null;

  const title = data.title;
  const logos = Array.isArray(data.logos_gallery) ? data.logos_gallery : [];

  // Normalize each logo entry to { url, alt }
  const normalizedLogos = logos
    .map((item) => {
      if (!item) return null;
      // If it's a plain URL string
      if (typeof item === 'string' && item.startsWith('http')) {
        return { url: item, alt: 'Partner logo' };
      }
      // If it's a WP media object
      if (typeof item === 'object') {
        const url = getImageUrl(item, 'medium') || item.url || item.source_url;
        const alt = getImageAlt(item, 'Partner logo');
        if (url) return { url, alt };
      }
      return null;
    })
    .filter(Boolean);

  if (normalizedLogos.length === 0 && !title) return null;

  return (
    <section className="py-44 bg-white">
      <div className="container">
        {title && (
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-center mb-32 primary-color">
            {title}
          </h2>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-20 gap-y-24 opacity-80 items-center justify-items-center">
          {normalizedLogos.map((logo, index) => (
            <div key={index} className="grayscale transition w-full">
              <Image
                src={logo.url}
                alt={logo.alt}
                width={150}
                height={120}
                className="h-[120px] w-full object-contain"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnerLogos;


