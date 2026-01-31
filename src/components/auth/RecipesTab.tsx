'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/common';

export const Recipes: React.FC = () => {
  const [myRecipes, setMyRecipes] = useState<any[]>([]);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    // localStorage에서 레시피 불러오기
    try {
      const saved = localStorage.getItem('myRecipes');
      if (saved) {
        setMyRecipes(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading recipes:', error);
    }
  }, [isClient]);

  const handleView = (recipe: any) => {
    try {
      // RecipeResult로 이동하기 위해 데이터를 sessionStorage에 저장
      sessionStorage.setItem('recipeData', JSON.stringify({
        scenes: recipe.scenes,
        videoUrl: recipe.videoUrl,
        capturedVideos: recipe.capturedVideos || {}, // 촬영 완료 데이터
        matchResults: recipe.matchResults || {}, // 매칭 결과
        recipeId: recipe.id, // 레시피 ID (업데이트용)
      }));
      
      // Home 탭으로 이동 (그곳에서 recipeData를 불러옴)
      window.location.href = '/home?view=recipe';
    } catch (error) {
      console.error('Error viewing recipe:', error);
      alert('Failed to view recipe. Please try again.');
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('이 레시피를 삭제하시겠습니까?')) {
      try {
        const updated = myRecipes.filter(r => r.id !== id);
        setMyRecipes(updated);
        localStorage.setItem('myRecipes', JSON.stringify(updated));
      } catch (error) {
        console.error('Error deleting recipe:', error);
        alert('Failed to delete recipe. Please try again.');
      }
    }
  };

  // Extract YouTube video ID
  const extractVideoId = (url: string) => {
    const patterns = [
      /shorts\/([a-zA-Z0-9_-]+)/,
      /watch\?v=([a-zA-Z0-9_-]+)/,
      /youtu\.be\/([a-zA-Z0-9_-]+)/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
          My Recipes <span className="text-2xl">📋</span>
        </h2>
        <p className="text-sm text-gray-900 font-medium">Your analyzed video recipes</p>
      </div>

      {myRecipes.length === 0 ? (
        <Card className="border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="text-center py-12">
            <div className="text-6xl mb-3 animate-pulse">🍿</div>
            <h3 className="text-base font-bold text-gray-900 mb-1.5">No recipes yet</h3>
            <p className="text-xs text-gray-900 font-medium mb-4">
              Start by pasting a video URL to create your first recipe!
            </p>
            <button
              onClick={() => window.location.href = '/paste'}
              className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
            >
              + Create Recipe
            </button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {myRecipes.map((recipe) => {
            const videoId = extractVideoId(recipe.videoUrl);
            const thumbnailUrl = videoId 
              ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
              : null;

            return (
              <div key={recipe.id} className="group">
                <div 
                  onClick={() => setPlayingVideo(videoId || '')}
                  className="block relative cursor-pointer"
                >
                  <div className="relative rounded-xl overflow-hidden shadow-lg aspect-[9/16] mb-2.5 ring-2 ring-transparent group-hover:ring-blue-400 transition-all duration-300">
                    {thumbnailUrl ? (
                      <img
                        src={thumbnailUrl}
                        alt={`Recipe #${recipe.id}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center"><div class="text-white text-4xl">🎥</div></div>';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                        <div className="text-white text-4xl">🎥</div>
                      </div>
                    )}
                    
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
                    
                    {/* Recipe Badge */}
                    <div className="absolute top-2 left-2">
                      <span className="bg-gradient-to-r from-green-600 to-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                        <span className="animate-pulse">📋</span> RECIPE
                      </span>
                    </div>

                    {/* Bottom Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white font-bold text-sm mb-1.5 drop-shadow-lg">
                        Recipe #{recipe.id}
                      </p>
                      <div className="flex items-center justify-between text-white text-xs">
                        <span className="flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg">
                          <span>🎬</span> {recipe.capturedCount || 0}/{recipe.totalScenes} scenes
                        </span>
                        <span className="bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg">
                          {new Date(recipe.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* View Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleView(recipe);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all shadow-md bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:scale-105"
                >
                  <span>👁️</span>
                  <span>View Recipe</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

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
  );
};
