'use client';

import { useState, useEffect } from 'react';
import { getPosts } from '../lib/api';
import PostCard from './common/PostCard';

export default function MorePostList() {
  const [morePosts, setMorePosts] = useState([]);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [stopLoadMore, setStopLoadMore] = useState(false);

  const fetchMorePosts = async () => {
    setLoading(true);
    const { data: posts, error } = await getPosts(7, page);
    if (error) {
      setStopLoadMore(true);
    } else {
      if (posts.length < 7) {
        setStopLoadMore(true);
      } else {
        setPage(page + 1);
      }
      setMorePosts(prev => [...prev, ...posts]);
    }
    setLoading(false);
  };

  const handleLoadMore = () => {
    fetchMorePosts();
  };
  
  return (
    <>
    { loading ? 
    <div className="w-full mt-12 text-center">
      <div className="inline-block h-10 w-10 md:h-16 md:w-16 animate-spin rounded-full border-4 border-solid border-orange-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
      </div>
    </div> 
    : (
      <>
        {morePosts && morePosts.length > 0 && morePosts.map((post, index) => {
          return <PostCard key={post.id} post={post} postIndex={index} />;
        })}
      </>
    )}

    {!stopLoadMore && !loading && (
      <div className="w-full mt-8 md:mt-12 text-center">
        <button className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold py-2 md:py-3 px-12 rounded-lg transition-colors duration-200 text-base md:text-lg" 
          onClick={handleLoadMore}
          disabled={loading}>
          Load More
        </button>
      </div>
    )}
    </>
  );
}