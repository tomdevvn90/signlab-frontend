'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

function StarRating({ rating, size = 'w-5 h-5' }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const fill = Math.min(Math.max(rating - (star - 1), 0), 1);
        return (
          <div key={star} className={`relative ${size}`}>
            {/* Empty star */}
            <svg
              className="absolute inset-0 w-full h-full text-gray-300"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {/* Filled star */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              <svg
                className="w-full h-full text-[#fbbf24]"
                fill="currentColor"
                viewBox="0 0 20 20"
                style={{ minWidth: size === 'w-5 h-5' ? '20px' : '28px' }}
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ReviewCard({ review }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = review.text && review.text.length > 180;

  return (
    <div className="flex-shrink-0 w-[calc(100vw-3rem)] sm:w-[calc(50vw-2.5rem)] lg:w-[calc(33.333vw-2.5rem)] max-w-[420px] bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col gap-3">
      {/* Author row */}
      <div className="flex items-center gap-3">
        {review.profile_photo_url ? (
          <img
            src={review.profile_photo_url}
            alt={review.author_name}
            className="w-10 h-10 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-[var(--primary-color,#0051bc)] flex items-center justify-center text-white font-semibold text-sm">
            {review.author_name?.charAt(0)?.toUpperCase() || '?'}
          </div>
        )}
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 text-sm truncate">
            {review.author_name}
          </p>
          <p className="text-xs text-gray-500">{review.relative_time_description}</p>
        </div>
      </div>

      {/* Stars */}
      <StarRating rating={review.rating} />

      {/* Review text */}
      {review.text && (
        <div className="flex-1">
          <p className="text-gray-700 text-sm leading-relaxed">
            {expanded || !isLong ? review.text : `${review.text.slice(0, 180)}...`}
          </p>
          {isLong && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-[var(--primary-color,#0051bc)] text-xs font-medium mt-1 hover:underline"
            >
              {expanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>
      )}

      {/* Google attribution */}
      <div className="flex items-center gap-1 mt-auto pt-2 border-t border-gray-100">
        <svg className="w-4 h-4" viewBox="0 0 48 48">
          <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
          <path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
          <path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
        </svg>
        <span className="text-[10px] text-gray-400">Google Review</span>
      </div>
    </div>
  );
}

export default function GoogleReviews() {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  const scrollRef = useRef(null);
  const animationRef = useRef(null);
  const scrollSpeedRef = useRef(0.5); // px per frame

  // Fetch reviews
  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch('/api/reviews');
        if (!res.ok) throw new Error('Failed to fetch reviews');
        const data = await res.json();
        setReviews(data.reviews || []);
        setRating(data.rating || 0);
        setTotalReviews(data.user_ratings_total || 0);
      } catch (err) {
        console.error('Error loading reviews:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, []);

  // Auto-scroll
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || reviews.length === 0) return;

    let scrollPos = 0;

    function animate() {
      if (!isPaused && container) {
        scrollPos += scrollSpeedRef.current;
        const maxScroll = container.scrollWidth - container.clientWidth;
        if (scrollPos >= maxScroll) {
          scrollPos = 0;
        }
        container.scrollLeft = scrollPos;
      }
      animationRef.current = requestAnimationFrame(animate);
    }

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [reviews, isPaused]);

  // Sync scroll position when user manually scrolls
  const handleScroll = useCallback(() => {
    // Update our tracked position to match manual scroll
  }, []);

  const scrollBy = useCallback((direction) => {
    const container = scrollRef.current;
    if (!container) return;
    const cardWidth = container.firstElementChild?.offsetWidth || 340;
    const scrollAmount = direction === 'left' ? -cardWidth - 16 : cardWidth + 16;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }, []);

  if (loading) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center gap-4">
            <div className="w-48 h-6 bg-gray-200 rounded animate-pulse" />
            <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
            <div className="flex gap-4 mt-6 overflow-hidden w-full">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-[340px] h-[220px] bg-gray-200 rounded-xl animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return null; // Silently fail - don't break the page
  }

  if (reviews.length === 0) return null;

  return (
    <section className="py-16 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            What Our Customers Say
          </h2>
          <div className="flex items-center justify-center gap-3">
            <StarRating rating={rating} size="w-7 h-7" />
            <span className="text-2xl font-bold text-gray-900">{rating}</span>
            <span className="text-gray-500 text-sm">
              from {totalReviews} reviews on Google
            </span>
          </div>
        </div>

        {/* Carousel wrapper */}
        <div className="relative group">
          {/* Left arrow */}
          <button
            onClick={() => scrollBy('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm shadow-lg rounded-full w-10 h-10 flex items-center justify-center text-gray-700 hover:text-[var(--primary-color,#0051bc)] hover:bg-white transition-all opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0"
            aria-label="Scroll left"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Cards container */}
          <div
            ref={scrollRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onScroll={handleScroll}
            className="flex gap-4 overflow-x-auto scrollbar-hide px-1 py-2"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {/* Duplicate reviews for seamless looping */}
            {[...reviews, ...reviews].map((review, idx) => (
              <ReviewCard key={`${review.author_name}-${idx}`} review={review} />
            ))}
          </div>

          {/* Right arrow */}
          <button
            onClick={() => scrollBy('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm shadow-lg rounded-full w-10 h-10 flex items-center justify-center text-gray-700 hover:text-[var(--primary-color,#0051bc)] hover:bg-white transition-all opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0"
            aria-label="Scroll right"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Google attribution */}
        <div className="flex items-center justify-center gap-2 mt-8 text-sm text-gray-500">
          <svg className="w-5 h-5" viewBox="0 0 48 48">
            <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
            <path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
          </svg>
          <span>Powered by Google Reviews</span>
        </div>
      </div>
    </section>
  );
}
