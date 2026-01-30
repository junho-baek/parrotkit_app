'use client';

import React, { useState } from 'react';
import { Card } from '@/components/common';
import Link from 'next/link';

// ============ EXPLORE: 트렌딩 레퍼런스 ============

interface TrendingReference {
  id: number;
  videoId: string;
  thumbnail: string;
  title: string;
  creator: string;
  views: string;
  likes: number;
  duration: string;
  isLiked: boolean;
  isSaved: boolean;
}

export const ExploreContent: React.FC = () => {
  const [trendingReferences, setTrendingReferences] = useState<TrendingReference[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  const categories = ['All', '🍳 Cooking', '💄 Beauty', '💪 Fitness', '🏠 DIY', '✈️ Travel', '😂 Comedy'];

  React.useEffect(() => {
    const fetchTrendingReferences = async () => {
      try {
        // Real YouTube Shorts Data
        const mockData: TrendingReference[] = [
          {
            id: 1,
            videoId: 'JhBOUaCkltg',
            thumbnail: 'https://img.youtube.com/vi/JhBOUaCkltg/maxresdefault.jpg',
            title: 'Amazing Cooking Shorts',
            creator: '@CookingChannel',
            views: '5.4M',
            likes: 450,
            duration: '00:25',
            isLiked: false,
            isSaved: false,
          },
          {
            id: 2,
            videoId: 'RiOqgmmcSvc',
            thumbnail: 'https://img.youtube.com/vi/RiOqgmmcSvc/maxresdefault.jpg',
            title: 'Viral Food Recipe',
            creator: '@FoodMaster',
            views: '3.2M',
            likes: 320,
            duration: '00:30',
            isLiked: false,
            isSaved: false,
          },
          {
            id: 3,
            videoId: 'isQbx375vSo',
            thumbnail: 'https://img.youtube.com/vi/isQbx375vSo/maxresdefault.jpg',
            title: 'Trending Recipe Tutorial',
            creator: '@ChefPro',
            views: '2.8M',
            likes: 280,
            duration: '00:35',
            isLiked: false,
            isSaved: false,
          },
          {
            id: 4,
            videoId: 'mzX3DSh-AW4',
            thumbnail: 'https://img.youtube.com/vi/mzX3DSh-AW4/maxresdefault.jpg',
            title: 'Popular Cooking Content',
            creator: '@KitchenMagic',
            views: '2.1M',
            likes: 210,
            duration: '00:28',
            isLiked: false,
            isSaved: false,
          },
        ];
        
        setTrendingReferences(mockData);
      } catch (error) {
        console.error('Failed to fetch trending references:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingReferences();
  }, []);

  // Optimistic UI: Like 토글
  const handleLike = async (id: number) => {
    // 즉시 UI 업데이트 (Optimistic)
    setTrendingReferences(prev =>
      prev.map(ref =>
        ref.id === id
          ? {
              ...ref,
              isLiked: !ref.isLiked,
              likes: ref.isLiked ? ref.likes - 1 : ref.likes + 1,
            }
          : ref
      )
    );

    try {
      // TODO: API 호출
      // Endpoint: POST /api/trending/like
      // Body: { referenceId: id }
      // Response: { success: boolean, likes: number }
      
      // const response = await fetch('/api/trending/like', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ referenceId: id }),
      // });
      // if (!response.ok) throw new Error('Like failed');
      
      // GA4 이벤트
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'like_trending_reference', {
          event_category: 'engagement',
          reference_id: id,
        });
      }
    } catch (error) {
      console.error('Failed to like:', error);
      
      // 실패 시 롤백
      setTrendingReferences(prev =>
        prev.map(ref =>
          ref.id === id
            ? {
                ...ref,
                isLiked: !ref.isLiked,
                likes: ref.isLiked ? ref.likes + 1 : ref.likes - 1,
              }
            : ref
        )
      );
    }
  };

  // Optimistic UI: Save 토글
  const handleSave = async (id: number) => {
    // 즉시 UI 업데이트 (Optimistic)
    setTrendingReferences(prev =>
      prev.map(ref => (ref.id === id ? { ...ref, isSaved: !ref.isSaved } : ref))
    );

    try {
      // TODO: API 호출
      // Endpoint: POST /api/trending/save
      // Body: { referenceId: id }
      // Response: { success: boolean }
      
      // const response = await fetch('/api/trending/save', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ referenceId: id }),
      // });
      // if (!response.ok) throw new Error('Save failed');
      
      // GA4 이벤트
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'save_trending_reference', {
          event_category: 'engagement',
          reference_id: id,
        });
      }
    } catch (error) {
      console.error('Failed to save:', error);
      
      // 실패 시 롤백
      setTrendingReferences(prev =>
        prev.map(ref => (ref.id === id ? { ...ref, isSaved: !ref.isSaved } : ref))
      );
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-1/2"></div>
        <div className="flex gap-2">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-8 w-20 bg-gray-200 rounded-full"></div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="aspect-[9/16] bg-gray-200 rounded-xl"></div>
          <div className="aspect-[9/16] bg-gray-200 rounded-xl"></div>
          <div className="aspect-[9/16] bg-gray-200 rounded-xl"></div>
          <div className="aspect-[9/16] bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="mb-3">
        <h2 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
          Explore <span className="text-2xl">🔥</span>
        </h2>
        <p className="text-sm text-gray-600">Most popular viral references</p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === category
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {trendingReferences.length === 0 ? (
        <Card className="border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="text-center py-12">
            <div className="text-6xl mb-3 animate-bounce">🔍</div>
            <h3 className="text-base font-bold text-gray-900 mb-1.5">No Trending Yet</h3>
            <p className="text-xs text-gray-600">Check back later for viral content</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {trendingReferences.map((ref) => (
              <div key={ref.id} className="group">
                <div 
                  onClick={() => setPlayingVideo(ref.videoId)}
                  className="block relative cursor-pointer"
                >
                  <div className="relative rounded-xl overflow-hidden shadow-lg aspect-[9/16] mb-2.5 ring-2 ring-transparent group-hover:ring-blue-400 transition-all duration-300">
                    <img
                      src={ref.thumbnail}
                      alt={ref.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/60 backdrop-blur-sm rounded-full p-4 group-hover:scale-110 transition-transform">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30"></div>
                    
                    {/* Trending Badge */}
                    <div className="absolute top-2 left-2">
                      <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                        <span className="animate-pulse">🔥</span> TRENDING
                      </span>
                    </div>

                    {/* Duration Badge */}
                    <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-1 rounded-lg">
                      {ref.duration}
                    </div>

                    {/* Bottom Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white font-bold text-sm line-clamp-2 mb-1.5 drop-shadow-lg">
                        {ref.title}
                      </p>
                      <p className="text-gray-200 text-xs mb-2 drop-shadow-md">{ref.creator}</p>
                      <div className="flex items-center justify-between text-white text-xs">
                        <span className="flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg">
                          <span>👁</span> {ref.views}
                        </span>
                        <span className="flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg">
                          <span className="text-red-400">❤</span> {ref.likes}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(ref.id);
                    }}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                      ref.isLiked
                        ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                    }`}
                  >
                    <span className="text-base">{ref.isLiked ? '❤️' : '🤍'}</span>
                    <span>Like</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSave(ref.id);
                    }}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                      ref.isSaved
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                    }`}
                  >
                    <span className="text-base">{ref.isSaved ? '⭐' : '☆'}</span>
                    <span>Save</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Video Player Modal */}
          {playingVideo && (
            <div 
              className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4"
              onClick={() => setPlayingVideo(null)}
            >
              <div 
                className="relative w-full max-w-md aspect-[9/16] bg-black rounded-xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setPlayingVideo(null)}
                  className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-sm text-white rounded-full p-2 hover:bg-black/80 transition-colors"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>

                {/* YouTube iframe */}
                <iframe
                  src={`https://www.youtube.com/embed/${playingVideo}?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
