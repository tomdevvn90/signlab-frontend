import React from 'react';
import Image from 'next/image';

const HeroSection = ({ data }) => (
  <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white section-padding">
    <div className="container">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="fade-in">
          {data.hero_main_text && (
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              {data.hero_main_text}
            </h1>
          )}
          {data.hero_sub_text && (
            <p className="text-xl mb-8 text-blue-100">
              {data.hero_sub_text}
            </p>
          )}
          {data.hero_button_text && data.hero_button_url && (
            <a
              href={data.hero_button_url}
              className="btn-primary bg-white text-blue-600 hover:bg-gray-100"
            >
              {data.hero_button_text}
            </a>
          )}
        </div>
        {data.hero_background_image?.url && (
          <div className="slide-in-right">
            <Image
              src={data.hero_background_image.url}
              alt={data.hero_background_image.alt || 'Hero Image'}
              width={600}
              height={400}
              className="rounded-lg shadow-2xl"
            />
          </div>
        )}
      </div>
    </div>
  </section>
);

export default HeroSection;