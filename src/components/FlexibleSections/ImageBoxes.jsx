'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import Image from 'next/image';

const ImageBoxes = ({ data }) => {
  const [visibleItems, setVisibleItems] = useState([]);
  const sectionRef = useRef(null);
  const itemRefs = useRef([]);  
  const boxes_items = data?.boxes_items;
  const paddingTop = (data?.padding_top !== "" && data?.padding_top != null) ? data.padding_top : 160;
  const paddingBottom = (data?.padding_bottom !== "" && data?.padding_bottom != null) ? data.padding_bottom : 160;
  const backgroundColor = data?.background_color?.trim() || '#FFFFFF';  

  // Unique section ID per instance (prefer provided id; otherwise generate stable one)
  const reactId = useId();
  const rawId = data?.section_id || data?.id || `image-boxes-${reactId}`;
  const sectionId = String(rawId).replace(/[^a-zA-Z0-9_-]/g, '-');  

  // Intersection Observer for fade-in animation
  useEffect(() => {
    if (!boxes_items || !Array.isArray(boxes_items) || boxes_items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            setVisibleItems(prev => {
              if (!prev.includes(index)) {
                return [...prev, index];
              }
              return prev;
            });
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    const currentRefs = itemRefs.current;
    currentRefs.forEach((ref, index) => {
      if (ref) {
        ref.dataset.index = index;
        observer.observe(ref);
      }
    });

    return () => {
      currentRefs.forEach(ref => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [boxes_items]);

  // Early return if no data or valid boxes_items
  if (!data || !boxes_items || !Array.isArray(boxes_items) || boxes_items.length === 0) {
    return null;
  }

  return (
    <section
      id={sectionId}
      ref={sectionRef}
      className="image-boxes-section"
      style={{
        '--section-pt-desktop': `${paddingTop}px`,
        '--section-pb-desktop': `${paddingBottom}px`,
        '--section-pt-tablet': `${Math.round(paddingTop * 0.7)}px`,
        '--section-pb-tablet': `${Math.round(paddingBottom * 0.7)}px`,
        '--section-pt-mobile': `${Math.round(paddingTop * 0.5)}px`,
        '--section-pb-mobile': `${Math.round(paddingBottom * 0.5)}px`,
        '--section-bg': backgroundColor
      }}
    >
      <div className="mx-auto px-6 lg:px-8">
        {/* Image Boxes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14">
          {boxes_items.map((box, index) => {
            const imageUrl = box.image.url ? box.image.url : null;
            const imageAlt = box.image.alt ? box.image.alt : 'Image';
            const isVisible = visibleItems.includes(index);
            
            return (
              <div 
                key={index}
                ref={(el) => (itemRefs.current[index] = el)}
                className={`flex flex-col items-center text-center space-y-5 sm:space-y-6 sm:p-4 transition-all duration-1000 ease-out ${
                  isVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{
                  transitionDelay: isVisible ? `${index * 250}ms` : '0ms'
                }}
              >
                {/* Image Container */}
                <div className="w-28 h-28 lg:w-32 lg:h-32 xl:w-40 xl:h-40 flex items-center justify-center">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={imageAlt}
                      width={160}
                      height={160}
                      className="w-full h-full object-contain filter brightness-0 saturate-100"
                      style={{
                        filter: 'brightness(0) saturate(100%) invert(27%) sepia(96%) saturate(7491%) hue-rotate(214deg) brightness(95%) contrast(101%)'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500 text-xs">Image</span>
                    </div>
                  )}
                </div>

                {/* Title */}
                <h3 
                  className="text-xl lg:text-2xl font-extrabold uppercase leading-tight tracking-wide"
                  style={{ color: 'var(--primary-color)' }}
                >
                  {box.title}
                </h3>

                {/* Description */}
                <p className="text-base leading-relaxed max-w-sm" style={{ color: 'var(--text-light)' }}>
                  {box.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      {/* Responsive paddings and background color from ACF options */}
      <style jsx>{`
        #${sectionId} {
          padding-top: var(--section-pt-desktop);
          padding-bottom: var(--section-pb-desktop);
          background-color: var(--section-bg);
        }
        @media (max-width: 1024px) {
          #${sectionId} {
            padding-top: var(--section-pt-tablet);
            padding-bottom: var(--section-pb-tablet);
          }
        }
        @media (max-width: 768px) {
          #${sectionId} {
            padding-top: var(--section-pt-mobile);
            padding-bottom: var(--section-pb-mobile);
          }
        }
      `}</style>
    </section>
  );
};

export default ImageBoxes;
