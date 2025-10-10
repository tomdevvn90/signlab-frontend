'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const ImageBoxes = ({ data }) => {
  const [visibleItems, setVisibleItems] = useState([]);
  const sectionRef = useRef(null);
  const itemRefs = useRef([]);  

  // Early return if no data
  if (!data) return null;

  const { boxes_items } = data;

  // Early return if no valid boxes_items
  if (!boxes_items || !Array.isArray(boxes_items) || boxes_items.length === 0) {
    return null;
  }

  // Intersection Observer for fade-in animation
  useEffect(() => {
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
        rootMargin: '0px 0px -200px 0px'
      }
    );

    itemRefs.current.forEach((ref, index) => {
      if (ref) {
        ref.dataset.index = index;
        observer.observe(ref);
      }
    });

    return () => {
      itemRefs.current.forEach(ref => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [boxes_items]);

  return (
    <section ref={sectionRef} className="py-20 lg:py-32 2xl:py-40 bg-white image-boxes-section">
      <div className="mx-auto px-6 lg:px-8">
        {/* Image Boxes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14">
          {boxes_items.map((box, index) => {
            const imageUrl = box.image.url ? box.image.url : null;
            const imageAlt = box.image.alt ? box.image.alt : 'Image';
            const isVisible = visibleItems.includes(index);
            
            return (
              <div 
                key={index}
                ref={(el) => (itemRefs.current[index] = el)}
                className={`flex flex-col items-center text-center space-y-6 p-4 transition-all duration-1000 ease-out ${
                  isVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{
                  transitionDelay: isVisible ? `${index * 300}ms` : '0ms'
                }}
              >
                {/* Image Container */}
                <div className="w-28 h-28 lg:w-32 lg:h-32 xl:w-40 xl:h-40 flex items-center justify-center mb-2">
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
    </section>
  );
};

export default ImageBoxes;
