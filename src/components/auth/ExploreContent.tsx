'use client';

import React, { useState } from 'react';
import { Card, ShortVideoCard } from '@/components/common';
import Link from 'next/link';
import { logClientEvent } from '@/lib/client-events';

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
}

interface PartnerCreator {
  id: number;
  name: string;
  handle: string;
  avatar: string;
}

const partnerCreators: PartnerCreator[] = [
  {
    id: 1,
    name: 'Minho Eats',
    handle: '@minhoeats',
    avatar: 'https://img.youtube.com/vi/JhBOUaCkltg/mqdefault.jpg',
  },
  {
    id: 2,
    name: 'Ava Beauty',
    handle: '@avabeauty',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 3,
    name: 'Coach Leon',
    handle: '@coachleon',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 4,
    name: 'Lena Builds',
    handle: '@lenabuilds',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 5,
    name: 'Miles Away',
    handle: '@milesaway',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 6,
    name: 'Nia Laughs',
    handle: '@nialaughs',
    avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=300&q=80',
  },
];

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

    // Save to localStorage for My page
    const likedVideos = JSON.parse(localStorage.getItem('likedVideos') || '[]');
    const currentRef = trendingReferences.find(r => r.id === id);
    
    if (currentRef) {
      if (!currentRef.isLiked) {
        // Add to liked
        likedVideos.push({
          id: currentRef.id,
          videoId: currentRef.videoId,
          thumbnail: currentRef.thumbnail,
          title: currentRef.title,
          creator: currentRef.creator,
          views: currentRef.views,
          likes: currentRef.likes + 1,
          likedAt: new Date().toISOString(),
        });
      } else {
        // Remove from liked
        const index = likedVideos.findIndex((v: any) => v.id === id);
        if (index > -1) likedVideos.splice(index, 1);
      }
      localStorage.setItem('likedVideos', JSON.stringify(likedVideos));
    }

    try {
      await logClientEvent('like_trending_reference', {
        event_category: 'engagement',
        reference_id: id,
      });
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

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="mb-4 inline-block">
          <img src="/parrot-logo.png" alt="Loading" className="w-16 h-16 animate-bounce-logo" />
        </div>
        <h3 className="text-base font-bold text-gray-900 mb-1.5">Loading trending videos...</h3>
        <p className="text-xs text-gray-600 font-medium">
          Discovering the hottest content for you
        </p>
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

      <div className="rounded-[26px] border border-rose-100 bg-gradient-to-r from-rose-50 via-white to-orange-50 p-3.5 shadow-[0_10px_28px_rgba(253,164,175,0.14)]">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900">
              Partner Creators <span className="text-base">🤍</span>
            </h3>
            <p className="text-xs font-medium text-gray-500">Reference makers we keep close</p>
          </div>
          <div className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-rose-500 ring-1 ring-rose-100">
            curated
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {partnerCreators.map((creator) => (
            <div key={creator.id} className="min-w-[84px] flex-shrink-0 text-center">
              <div className="mx-auto mb-2 h-[74px] w-[74px] rounded-full bg-gradient-to-br from-rose-300 via-pink-200 to-orange-200 p-[2px] shadow-sm">
                <div className="h-full w-full overflow-hidden rounded-full bg-white p-[3px]">
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="h-full w-full rounded-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
              <p className="truncate text-[13px] font-semibold text-gray-900">{creator.name}</p>
              <p className="truncate text-[11px] font-medium text-gray-500">{creator.handle}</p>
            </div>
          ))}
        </div>
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
              <ShortVideoCard
                key={ref.id}
                thumbnail={ref.thumbnail}
                thumbnailAlt={ref.title}
                title={ref.title}
                subtitle={ref.creator}
                onPreview={() => setPlayingVideo(ref.videoId)}
                onAction={() => handleLike(ref.id)}
                actionLabel={ref.isLiked ? 'Liked' : 'Like'}
                actionIcon={<span className="text-lg">{ref.isLiked ? '❤️' : '🤍'}</span>}
                actionMeta={`(${ref.likes})`}
                actionClassName={
                  ref.isLiked
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-50 hover:scale-105 border-2 border-gray-200'
                }
                topLeftBadge={(
                  <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                    <span className="animate-pulse">🔥</span> TRENDING
                  </span>
                )}
                topRightBadge={(
                  <div className="bg-black/70 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-1 rounded-lg">
                    {ref.duration}
                  </div>
                )}
                leftMetric={{
                  icon: <span>👁</span>,
                  value: ref.views,
                }}
                rightMetric={{
                  icon: <span className="text-red-400">❤</span>,
                  value: ref.likes,
                }}
              />
            ))}
          </div>

          {/* Video Player Modal */}
          {playingVideo && (
            <div 
              className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4"
              onClick={() => setPlayingVideo(null)}
            >
              <div 
                className="relative w-full max-w-[320px] aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Back Button */}
                <button
                  onClick={() => setPlayingVideo(null)}
                  className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-sm text-white rounded-full p-2.5 hover:bg-black/70 transition-all flex items-center gap-2 pr-3"
                  aria-label="Go back"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                  </svg>
                  <span className="text-sm font-medium">Back</span>
                </button>

                {/* YouTube iframe */}
                <iframe
                  src={`https://www.youtube.com/embed/${playingVideo}?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1&playsinline=1`}
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
