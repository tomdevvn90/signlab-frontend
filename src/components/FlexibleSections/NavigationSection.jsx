'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';

const NavigationSection = ({ data }) => {
  const [hoveredImage, setHoveredImage] = useState(null);

  const backgroundImage = data.nav_bg_image ? data.nav_bg_image.url : '';
  const backgroundColor = data.nav_bg_color ? '[' + data.nav_bg_color + ']' : '[#0051bc]';
  const heroBgContent = data.nav_bg_content_color ? '[' + data.nav_bg_content_color + ']' : '[#3C64DBED]';
  const fontColor = data.nav_font_color ? '[' + data.nav_font_color + ']' : '[#ffffff]';
  const navHeading = data.nav_heading ? data.nav_heading : '';
  const navMenuItems = data.nav_menu_items ? data.nav_menu_items : [];

  useEffect(() => {
    const toggleMenuButtonIcon = document.getElementById('toggle-menu-button-icon');
    toggleMenuButtonIcon.innerHTML = '<path stroke-linecap="square" stroke-linejoin="square" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
  }, []);

  return (
    <section
      className={`relative flex flex-col md:flex-row pt-[80px] md:pt-0 text-white min-h-screen bg-${backgroundColor} overflow-hidden`}
    >
      <div 
        className="w-full h-[250px] sm:h-[300px] md:h-auto md:w-1/2 lg:w-2/3 md:bg-fixed bg-cover bg-center bg-no-repeat transition-all duration-300 ease-in-out"
        style={{
          backgroundImage: hoveredImage ? `url(${hoveredImage})` : `url(${backgroundImage})`
        }}
      ></div>

      <div className={`w-full md:w-1/2 lg:w-1/3 flex flex-row md:flex-col justify-between md:justify-center pt-6 pb-6 md:pt-28 lg:pt-40 lg:pb-24 px-2 sm:px-4 md:px-8 lg:px-12 2xl:px-20 bg-${heroBgContent}`}>
        {navHeading && (
          <div className="flex items-start px-3 md:hidden">
            <h3 className="text-blue-300 text-5xl font-extrabold [writing-mode:vertical-rl] rotate-180">{navHeading}</h3>
          </div>
        )}

        <div>
          {navMenuItems.map((item, index) => {
            const itemUrl = item.link.url ? item.link.url : '#';
            const itemTitle = item.link.title ? item.link.title : '';
            const target = item.link.target ? item.link.target : '_self';

            return (
              <Link 
                key={index} 
                className={`flex items-center justify-end text-${fontColor} hover:text-[#7bb6ff]`} 
                href={itemUrl} 
                target={target}
                onMouseEnter={() => setHoveredImage(item.image.url)}
                onMouseLeave={() => setHoveredImage(null)}
              >
                <h3 className="py-1 md:py-[6px] text-xl sm:text-2xl md:text-2xl xl:text-3xl 2xl:text-4xl font-extrabold text-right">
                  {itemTitle}
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

export default NavigationSection;