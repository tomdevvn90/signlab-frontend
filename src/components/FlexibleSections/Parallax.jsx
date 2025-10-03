'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const Parallax = ({ data }) => {
  const sectionRef = useRef(null);
  const [hideBg, setHideBg] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      // If the section is completely out of view (scrolled past)
      if (rect.bottom <= 0 || rect.top >= window.innerHeight) {
        setHideBg(true);
      } else {
        setHideBg(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (!data) return null;

  const imageData = data.background_image;

  return (
    <section ref={sectionRef} className="relative h-[80vh] min-h-[600px] overflow-hidden">
      {/* Background Image with Parallax Effect */}
      {imageData && (
        <div 
          className={`fixed inset-0 w-full h-[100vh] z-[-1]${hideBg ? ' hidden' : ''}`}
        >
          <Image
            src={imageData.url}
            alt={imageData.alt}
            fill
            className="object-cover object-center"
            priority={false}
            sizes="100vw"
          />
        </div>
      )}
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/10"></div>
      
      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="container text-center px-4">
          {data.title && (
            <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white uppercase tracking-wide leading-tight">
              {data.title}
            </h2>
          )}
        </div>
      </div>
    </section>
  );
};

export default Parallax;