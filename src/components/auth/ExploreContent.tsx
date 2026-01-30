'use client';

import React, { useState } from 'react';
import { Card } from '@/components/common';
import Link from 'next/link';

// ============ EXPLORE: 트렌딩 레퍼런스 ============

interface TrendingReference {
  id: number;
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

  React.useEffect(() => {
    const fetchTrendingReferences = async () => {
      try {
        // TODO: API 연결 시 실제 데이터 가져오기
        // Endpoint: GET /api/trending/references
        // Response: { references: TrendingReference[] }
        
        const mockData: TrendingReference[] = [
          {
            id: 1,
            thumbnail: 'https://via.placeholder.com/300x400/ec4899/ffffff?text=Trending+1',
            title: 'Viral Cooking Recipe - 5M Views',
            creator: '@chefmaster',
            views: '5.4M',
            likes: 450,
            duration: '00:25',
            isLiked: false,
            isSaved: false,
          },
          {
            id: 2,
            thumbnail: 'https://via.placeholder.com/300x400/8b5cf6/ffffff?text=Trending+2',
            title: 'Beauty Makeup Tutorial',
            creator: '@beautyguru',
            views: '3.2M',
            likes: 320,
            duration: '00:30',
            isLiked: false,
            isSaved: false,
          },
          {
            id: 3,
            thumbnail: 'https://via.placeholder.com/300x400/f97316/ffffff?text=Trending+3',
            title: 'Fitness Morning Routine',
            creator: '@fitlife',
            views: '2.8M',
            likes: 280,
            duration: '00:35',
            isLiked: false,
            isSaved: false,
          },
          {
            id: 4,
            thumbnail: 'https://via.placeholder.com/300x400/10b981/ffffff?text=Trending+4',
            title: 'DIY Home Decor Ideas',
            creator: '@homediy',
            views: '2.1M',
            likes: 210,
            duration: '00:28',
            isLiked: false,
            isSaved: false,
          },
          {
            id: 5,
            thumbnail: 'https://via.placeholder.com/300x400/3b82f6/ffffff?text=Trending+5',
            title: 'Travel Vlog - Hidden Gems',
            creator: '@wanderlust',
            views: '1.9M',
            likes: 190,
            duration: '00:32',
            isLiked: false,
            isSaved: false,
          },
          {
            id: 6,
            thumbnail: 'https://via.placeholder.com/300x400/ef4444/ffffff?text=Trending+6',
            title: 'Comedy Skit - Viral Moments',
            creator: '@laughfactory',
            views: '1.7M',
            likes: 170,
            duration: '00:20',
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
      <div className="py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading trending...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Explore 🔥</h2>
        <p className="text-sm text-gray-600">Most popular viral references</p>
      </div>

      {trendingReferences.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Trending Yet</h3>
          <p className="text-gray-600">Check back later for viral content</p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {trendingReferences.map((ref) => (
            <div key={ref.id} className="group">
              <Link href={`/paste?ref=${ref.id}`} className="block">
                <div className="relative rounded-xl overflow-hidden shadow-md aspect-[9/16] mb-2">
                  <img
                    src={ref.thumbnail}
                    alt={ref.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Duration Badge */}
                  <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {ref.duration}
                  </div>

                  {/* Bottom Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3">
                    <p className="text-white font-semibold text-sm line-clamp-2 mb-1">
                      {ref.title}
                    </p>
                    <p className="text-gray-300 text-xs mb-1">{ref.creator}</p>
                    <div className="flex items-center justify-between text-white text-xs">
                      <span className="flex items-center gap-1">
                        <span>👁</span> {ref.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="text-red-500">❤</span> {ref.likes}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleLike(ref.id)}
                  className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    ref.isLiked
                      ? 'bg-red-50 text-red-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{ref.isLiked ? '❤️' : '🤍'}</span>
                  <span>Like</span>
                </button>
                <button
                  onClick={() => handleSave(ref.id)}
                  className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    ref.isSaved
                      ? 'bg-blue-50 text-blue-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{ref.isSaved ? '⭐' : '☆'}</span>
                  <span>Save</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
