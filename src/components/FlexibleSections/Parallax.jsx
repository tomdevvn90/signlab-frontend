'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const Parallax = ({ data }) => {
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      const windowHeight = window.innerHeight;
      
      // Check visibility
      if (rect.bottom <= 0 || rect.top >= windowHeight) {
        setIsVisible(false);
        return;
      } else {
        setIsVisible(true);
      }
      
      // Calculate scroll progress (0 to 1)
      // When section enters from bottom: progress = 0
      // When section exits from top: progress = 1
      const scrollStart = sectionTop + sectionHeight;
      const scrollRange = sectionHeight + windowHeight;
      const progress = 1 - (scrollStart / scrollRange);
      
      setScrollProgress(Math.max(0, Math.min(1, progress)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (!data) return null;

  const imageData = data.background_image;
  
  // Calculate transform values based on scroll progress
  const imageScale = 1 + (scrollProgress * 0.4); // Scale from 1 to 1.4
  const imageTranslateY = scrollProgress * -20; // Move up by 20%
  const contentTranslateY = scrollProgress * 50; // Content moves slower (parallax effect)

  return (
    <section ref={sectionRef} className="relative h-[500px] lg:h-[70vh] xl:h-[80vh] lg:min-h-[600px] overflow-hidden">
      {/* Background Image with Parallax Effect */}
      {imageData && isVisible && (
        <div 
          className="fixed inset-0 w-full h-screen z-[-1] duration-300"
          style={{ 
            willChange: 'transform'
          }}
        >
          <div
            className="w-full h-full"
            style={{
              transform: `scale(${imageScale}) translateY(${imageTranslateY}%)`,
              transition: 'none',
              willChange: 'transform'
            }}
          >
            <Image
              src={imageData.url}
              alt={imageData.alt}
              priority={false}
              width={2048}
              height={400}
              className="object-cover object-center w-full h-full"
              sizes="100vw"
              quality={100}
            />
          </div>
        </div>
      )}
      
      {/* Dynamic Overlay */}
      <div 
        className="absolute inset-0 bg-black/10 duration-300"
      ></div>
      
      {/* Content with Parallax */}
      <div 
        className="relative z-10 h-full flex items-center justify-center"
        style={{
          transform: `translateY(${contentTranslateY}px)`,
          transition: 'none',
          willChange: 'transform'
        }}
      >
        <div className="container text-center px-4">
          {data.title && (
            <h2 
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white uppercase tracking-wide leading-tight"
            >
              {data.title}
            </h2>
          )}
        </div>
      </div>
    </section>
  );
};

export default Parallax;