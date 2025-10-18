import React from 'react';
import { getYouTubeVideoId } from '../../lib/utils';

const YoutubeVideoPlayer = ({ src, alt, className = '' }) => {

  const videoId = getYouTubeVideoId(src);
  const youtubeEmbedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : null;

  return (
    <div className={`relative ${className}`}>
      <div className="relative w-full h-full">
        {youtubeEmbedUrl && (
          <iframe
            src={youtubeEmbedUrl}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={alt}
          />
        )}
      </div>
    </div>
  );
};

export default YoutubeVideoPlayer;
