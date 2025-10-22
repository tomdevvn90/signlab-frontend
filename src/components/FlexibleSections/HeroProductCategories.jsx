import Link from 'next/link';
import React from 'react';

const HeroProductCategories = ({ data }) => {

  const backgroundColor = data.hero_bg_color ? '[' + data.hero_bg_color + ']' : '[#0051bc]';
  const heroBgContent = data.hero_bg_content ? '[' + data.hero_bg_content + ']' : '[#3C64DBED]';
  const imageUrl = data.hero_bg_image.url ? data.hero_bg_image.url : null;
  const navHeading = data.hero_nav_heading ? data.hero_nav_heading : '';
  const heroProducts = data.hero_products ? data.hero_products : [];

  // Compose background style for fallback image if no video
  const backgroundImageStyle = imageUrl
    ? {
        backgroundImage: `url('${imageUrl}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }
    : {};

  return (
    <section
      className={`relative flex flex-col md:flex-row pt-[80px] md:pt-0 text-white min-h-screen bg-${backgroundColor} overflow-hidden`}
    >
      <div className="w-full h-[250px] sm:h-[300px] md:h-auto md:w-1/2 md:bg-fixed"
        style={backgroundImageStyle} >
      </div>

      <div className={`w-full md:w-1/2 flex flex-row md:flex-col justify-between md:justify-center pt-6 pb-6 md:pt-28 lg:pt-40 lg:pb-24 px-2 sm:px-4 md:px-8 lg:px-16 2xl:px-20 bg-${heroBgContent}`}>
        {navHeading && (
          <div className="flex items-start px-3 md:hidden">
            <h3 className="text-blue-300 text-5xl font-extrabold [writing-mode:vertical-rl] rotate-180">{navHeading}</h3>
          </div>
        )}

        <div>
          {heroProducts.map((product, index) => {
            const productUrl = product.link.url ? product.link.url : '#';
            const productTitle = product.link.title ? product.link.title : '';
            const target = product.link.target ? product.link.target : '_self';

            return (
              <Link key={index} className="product-category flex items-center justify-end text-white hover:text-[#7bb6ff]" href={productUrl} target={target}>
                <h3 className="py-1 md:py-[6px] text-xl sm:text-2xl md:text-3xl xl:text-4xl font-extrabold text-right">
                  {productTitle}
                </h3> 
                <svg className="inline-block md:hidden ml-1 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )
          })}
        </div> 
      </div>
    </section>
  );
};

export default HeroProductCategories;