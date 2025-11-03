import React from 'react';
import { getYouTubeVideoId } from '../../lib/utils';

const VideoPlayer = ({ src, alt, className = '', autoplay = false, controls = true }) => {
  if (!src) return null;

  // Check if it's a YouTube URL
  const youtubeVideoId = getYouTubeVideoId(src);
  const isYouTube = !!youtubeVideoId;

  // Check if it's a Vimeo URL
  const vimeoRegex = /(?:vimeo\.com\/)(?:.*\/)?(\d+)/;
  const vimeoMatch = src.match(vimeoRegex);
  const isVimeo = !!vimeoMatch;
  const vimeoVideoId = vimeoMatch ? vimeoMatch[1] : null;

  // Check if it's an MP4 or other video file
  const videoFileRegex = /\.(mp4|webm|ogg)$/i;
  const isVideoFile = videoFileRegex.test(src);

  // Render YouTube iframe
  if (isYouTube) {
    // Build YouTube embed URL with conditional parameters
    let youtubeParams = ['rel=0'];
    if (autoplay) {
      youtubeParams.push('autoplay=1');
      youtubeParams.push('mute=1'); // Required for autoplay in most browsers
    }
    if (!controls) {
      youtubeParams.push('controls=0');
    }
    const youtubeEmbedUrl = `https://www.youtube.com/embed/${youtubeVideoId}?${youtubeParams.join('&')}`;
    
    const allowAttributes = autoplay 
      ? 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; autoplay'
      : 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    
    return (
    //   <div className={`relative ${className}`}>
    //     <div className="relative w-full h-full">
          <iframe
            src={youtubeEmbedUrl}
            className="w-full h-[320px] sm:h-[360px] md:h-[500px] lg:h-full"
            frameBorder="0"
            allow={allowAttributes}
            allowFullScreen
            title={alt}
          />
    //     </div>
    //   </div>
    );
  }

  // Render Vimeo iframe
  if (isVimeo) {
    // Build Vimeo embed URL with conditional parameters
    let vimeoParams = [];
    if (autoplay) {
      vimeoParams.push('autoplay=1');
      vimeoParams.push('muted=1'); // Required for autoplay
    }
    if (!controls) {
      vimeoParams.push('controls=0');
    }
    const vimeoEmbedUrl = vimeoParams.length > 0
      ? `https://player.vimeo.com/video/${vimeoVideoId}?${vimeoParams.join('&')}`
      : `https://player.vimeo.com/video/${vimeoVideoId}`;
    
    return (
    //   <div className={`relative ${className}`}>
    //     <div className="relative w-full h-full">
          <iframe
            src={vimeoEmbedUrl}
            className="w-full h-[300px] sm:h-[360px] md:h-[500px] lg:h-full"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={alt}
          />
    //     </div>
    //   </div>
    );
  }

  // Render MP4 or other video file
  if (isVideoFile) {
    return (
    //   <div className={`relative ${className}`}>
    //     <div className="relative w-full h-full">
          <video
            src={src}
            controls={controls}
            autoPlay={autoplay}
            muted={autoplay} // Required for autoplay in most browsers
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            Your browser does not support the video tag.
          </video>
    //     </div>
    //   </div>
    );
  }

  // If no valid video format detected, return null
  return null;
};

export default VideoPlayer;

