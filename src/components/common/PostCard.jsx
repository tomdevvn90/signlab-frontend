import Link from 'next/link';
import Image from 'next/image';
import YoutubeVideoPlayer from './YoutubeVideoPlayer';
import { formatDate } from '../../lib/utils';

export default function PostCard({ post, postIndex }) {
  const youtubeUrl = post.acf?.beplus_video || null;
  const featuredImageUrl = post.yoast_head_json?.og_image?.[0]?.url || null;

  const isFirstItem = postIndex === 0 || postIndex % 7 === 0;
  const isSecondItem = postIndex !== 0 && postIndex % 7 === 1;
  const isThirdItem = postIndex !== 0 && postIndex % 7 === 2;
  const isFourthItem = postIndex !== 0 && postIndex % 7 === 3;
  const isFifthItem = postIndex !== 0 && postIndex % 7 === 4;
  const isSixthItem = postIndex !== 0 && postIndex % 7 === 5;
  const isSeventhItem = postIndex !== 0 && postIndex % 7 === 6;

  return (
    <article className={`relative group cursor-pointer p-2 w-full 
      ${isFirstItem ? 'md:w-1/2 xl:w-3/5' : ''}
      ${isSecondItem ? 'md:w-1/2 xl:w-2/5' : ''}
      ${isThirdItem ? 'md:w-1/2 xl:w-2/5' : ''}
      ${isFourthItem ? 'md:w-1/2 xl:w-3/5' : ''}
      ${isFifthItem ? 'md:w-full xl:w-full' : ''}
      ${isSixthItem ? 'md:w-1/2 xl:w-1/2' : ''}
      ${isSeventhItem ? 'md:w-1/2 xl:w-1/2' : ''}`}
      >
      <Link href={`/the-latest/${post.slug}`}>
        <div className={`relative 
          ${isFifthItem ? 'h-[320px] md:h-[400px] lg:h-[500px] xl:h-[600px]' : 'h-[320px] lg:h-[400px]'} w-full`}>
          {youtubeUrl ? (
            <YoutubeVideoPlayer
              src={youtubeUrl}
              alt={post.title.rendered || 'Video'}
              className="w-full h-full"
            />
          ) : featuredImageUrl ? (
            <Image
              src={featuredImageUrl}
              alt={post.title.rendered}
              fill
              className="object-cover transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {/* Dark gradient overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/90 via-black/90 to-transparent"></div>

          {/* Text overlays */}
          <div className="absolute bottom-0 left-0 right-0 h-24 pl-4 xl:pl-6 pr-3 pb-3 flex flex-col justify-between">            
            <div className="text-white mt-auto">
              <h3 className="text-lg font-bold xl:font-extrabold leading-tight mb-1 md:mb-2 line-clamp-2"
                dangerouslySetInnerHTML={{ __html: post.title.rendered }}>
              </h3>
              <div className="text-sm md:text-base font-normal opacity-90 leading-tight">
                {formatDate(post.date)}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}