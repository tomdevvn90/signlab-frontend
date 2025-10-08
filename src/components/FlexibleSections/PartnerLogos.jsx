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
    <section className="py-20 xl:py-32 2xl:py-44 bg-white">
      <div className="lg:max-w-[900px] xl:max-w-[1000px] 2xl:max-w-[1280px] mx-auto">
        {title && (
          <h2 className="px-6 text-3xl md:text-4xl lg:text-5xl font-extrabold text-center mb-16 lg:mb-24 xl:mb-32 text-primary">
            {title}
          </h2>
        )}
        {/* Mobile & Medium: Horizontal scroll */}
        <div className="lg:hidden overflow-x-auto scrollbar-hide w-[9999px]">
          <div className="flex gap-10 animate-scroll-right">
            {/* Duplicate logos for infinite scroll effect */}
            {[...normalizedLogos, ...normalizedLogos].map((logo, index) => (
              <div key={index} className="flex-shrink-0 grayscale transition h-[80px] w-[120px]">
                <Image
                  src={logo.url}
                  alt={logo.alt}
                  width={120}
                  height={80}
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: Grid layout */}
        <div className="hidden lg:grid md:grid-cols-4 lg:grid-cols-6 gap-x-20 gap-y-24 opacity-80 items-center justify-items-center">
          {normalizedLogos.map((logo, index) => (
            <div key={index} className="grayscale transition w-full h-[120px]">
              <Image
                src={logo.url}
                alt={logo.alt}
                width={150}
                height={120}
                className="h-[80px] lg:h-[120px] w-full object-contain"
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
