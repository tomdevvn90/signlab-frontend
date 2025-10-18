import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import VideoPlayer from './common/YoutubeVideoPlayer';
import ImageGallery from './common/ImageGallery';
import CallToActionSection from './FlexibleSections/CallToAction';
import Form from './FlexibleSections/Form';
import { getImageUrl, getImageAlt, 
  getYouTubeThumbnailUrl, formatDate } from '../lib/utils';

export default function BlogPost({ post }) {

  const {
    title,
    content,
    date,
    acf,
    featured_image,
    theme_options
  } = post;

  const globalFlexibleContent = theme_options?.flexible_content_sections;

  // Get video data from ACF
  const videoData = acf?.beplus_video;
  const videoUrl = videoData ? getImageUrl(videoData) : null;
  const videoAlt = videoData ? getImageAlt(videoData, 'Blog post video') : 'Blog post video';

  // Get gallery data from ACF
  const galleryData = acf?.beplus_gallery;
  const galleryImages = galleryData && Array.isArray(galleryData) ? galleryData : [];

  // Get featured image
  let featuredImageUrl = featured_image ? getImageUrl(featured_image) : null;
  let featuredImageAlt = featured_image ? getImageAlt(featured_image, title) : title;
  if (! featuredImageUrl) {
    featuredImageUrl = videoUrl ? getYouTubeThumbnailUrl(videoUrl) : null;
    featuredImageAlt = videoAlt;
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section with Featured Image */}
      {featuredImageUrl && (
        <section className="relative h-[40vh] sm:h-[60vh] min-h-[400px]">
          <Image
            src={featuredImageUrl}
            alt={featuredImageAlt}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        </section>
      )}

      {/* Blog Content */}
      <section className="py-12 lg:py-20">
        <div className="max-w-[1780px] mx-auto px-4 md:px-8">
          <div className="mb-8 sm:mb-12 text-center max-w-4xl mx-auto">

            {/* Title */}
            <h1 className="text-4xl lg:text-5xl font-extrabold mb-6 sm:mb-10 text-[#0051bc]" 
              dangerouslySetInnerHTML={{ __html: title }}>
            </h1>

            {/* Date */}
            <div className="text-[#868686] mb-6 sm:mb-10 text-center text-xl sm:text-2xl">
              {formatDate(date)}
            </div>

            {/* Separator */}
            <div className="w-32 sm:w-40 h-1 sm:h-2 bg-blue-400 mx-auto"></div>
          </div>

          {/* Post Content */}
          <div className="prose prose-lg mb-12 max-w-5xl mx-auto">
            <div
              className="wp-content text-center text-lg text-[#868686]"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>

          {/* Video Section */}
          {videoUrl && (
            <div className="mb-16 max-w-5xl mx-auto">
              <VideoPlayer
                src={videoUrl}
                alt={videoAlt}
                className="w-full h-[400px] lg:h-[500px] rounded-lg shadow-lg"
              />
            </div>
          )}

          {/* Gallery Section */}
          {galleryImages.length > 0 && (
            <div className="mb-16">
              <ImageGallery galleryImages={galleryImages} />
            </div>
          )}

          {/* Back Button */}
          <div className="text-center">
            <Link
              href="/the-latest"
              className="inline-flex items-center px-6 py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors duration-200"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to The Latest
            </Link>
          </div>
        </div>
      </section>

      {globalFlexibleContent && globalFlexibleContent.map((block, index) => {
        switch (block.acf_fc_layout) {
          case 'cta_section':
            return <CallToActionSection key={index} data={block} />;
          case 'form_section':
            return <Form key={index} data={block} />;
          default:
            console.warn(`Unknown ACF layout: ${block.acf_fc_layout}`);
            return null;
        }
      })}

    </div>
  );
};
