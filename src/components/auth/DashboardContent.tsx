'use client';

import React, { useState } from 'react';
import { Card, RecipeResult } from '@/components/common';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

// ============ HOME: 최근 Paste한 레퍼런스들 ============
export const Home: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [recentReferences, setRecentReferences] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [recipeData, setRecipeData] = React.useState<any>(null);
  const [playingVideo, setPlayingVideo] = React.useState<string | null>(null);

  // Check for recipe view
  React.useEffect(() => {
    const viewMode = searchParams?.get('view');
    if (viewMode === 'recipe') {
      const data = sessionStorage.getItem('recipeData');
      if (data) {
        setRecipeData(JSON.parse(data));
      }
    }
  }, [searchParams]);

  React.useEffect(() => {
    const fetchRecentReferences = async () => {
      try {
        // YouTube Shorts Reference - Pasted videos
        const mockData = [
          {
            id: 1,
            videoId: '8qUUuVkhtYQ',
            thumbnail: 'https://img.youtube.com/vi/8qUUuVkhtYQ/maxresdefault.jpg',
            title: 'Amazing Cooking Shorts',
            creator: '@CookingMaster',
            duration: '00:25',
            views: '5.4K',
            createdAt: '2 hours ago',
          },
        ];
        setRecentReferences(mockData);
      } catch (error) {
        console.error('Failed to fetch recent references:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentReferences();
  }, []);

  // Handle back from recipe view
  const handleBackFromRecipe = () => {
    sessionStorage.removeItem('recipeData');
    setRecipeData(null);
    router.push('/home');
  };

  // Show recipe result if available
  if (recipeData) {
    return (
      <RecipeResult
        scenes={recipeData.scenes}
        videoUrl={recipeData.videoUrl}
        onBack={handleBackFromRecipe}
        recipeId={recipeData.recipeId}
        initialCapturedVideos={recipeData.capturedVideos}
        initialMatchResults={recipeData.matchResults}
      />
    );
  }

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        <div className="h-24 bg-gray-200 rounded"></div>
        <div className="grid grid-cols-3 gap-3">
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="aspect-[9/16] bg-gray-200 rounded-xl"></div>
          <div className="aspect-[9/16] bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
          Welcome Back! <span className="animate-bounce">👋</span>
        </h2>
        <p className="text-sm text-gray-600">Your creative workspace</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-2.5">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 p-3">
          <div className="text-2xl font-bold text-blue-600">{recentReferences.length}</div>
          <div className="text-[10px] text-blue-700 font-medium mt-0.5">References</div>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 p-3">
          <div className="text-2xl font-bold text-purple-600">0</div>
          <div className="text-[10px] text-purple-700 font-medium mt-0.5">Recipes</div>
        </Card>
        <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 p-3">
          <div className="text-2xl font-bold text-pink-600">0</div>
          <div className="text-[10px] text-pink-700 font-medium mt-0.5">Views</div>
        </Card>
      </div>

      {/* Quick Action Card */}
      <Card className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold mb-1 flex items-center gap-1.5">
              <span className="text-xl">✨</span> Create Recipe
            </h3>
            <p className="text-xs text-white/90">Turn viral videos into actionable recipes</p>
          </div>
          <Link
            href="/paste"
            className="bg-white text-blue-600 px-4 py-2.5 rounded-xl text-sm font-bold hover:scale-105 transition-transform shadow-lg"
          >
            + New
          </Link>
        </div>
      </Card>

      <div>
        <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
          <span className="text-lg">📌</span> Recent References
        </h3>
        
        {recentReferences.length === 0 ? (
          <Card className="border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="text-center py-10">
              <div className="text-6xl mb-3 animate-pulse">🎬</div>
              <h3 className="text-base font-bold text-gray-900 mb-1.5">No References Yet</h3>
              <p className="text-xs text-gray-600 mb-4">Start by pasting your first viral video URL</p>
              <Link
                href="/paste"
                className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
              >
                + Add Reference
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {recentReferences.map((ref) => (
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
                    
                    {/* Badge */}
                    <div className="absolute top-2 left-2">
                      <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                        <span className="animate-pulse">✨</span> NEW
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
                        <span className="bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg">
                          {ref.createdAt}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
    </div>
  );
};

// ============ RECIPES: 내가 만든 레시피들 ============
export const Recipes: React.FC = () => {
  const [recipes, setRecipes] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    const fetchRecipes = async () => {
      try {
        // Fetch real analyzed recipe from API
        const videoUrl = 'https://www.youtube.com/shorts/8qUUuVkhtYQ';
        
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: videoUrl,
            niche: 'Cooking',
            goal: 'Create engaging cooking content',
            describe: 'Viral cooking shorts recipe'
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to analyze video');
        }

        const data = await response.json();
        
        const recipeData = {
          id: 1,
          videoId: data.videoId,
          videoUrl: videoUrl,
          title: 'Amazing Cooking Shorts Recipe',
          thumbnail: 'https://img.youtube.com/vi/8qUUuVkhtYQ/maxresdefault.jpg',
          totalScenes: data.scenes.length,
          capturedCount: data.scenes.length,
          createdAt: new Date().toISOString(),
          scenes: data.scenes.map((scene: any, index: number) => ({
            id: scene.id,
            timestamp: `${scene.startTime}-${scene.endTime}`,
            description: scene.description,
            shotType: index % 3 === 0 ? 'Wide Shot' : index % 3 === 1 ? 'Close-up' : 'Medium Shot',
            cameraAngle: index % 2 === 0 ? 'Eye Level' : 'Top Down',
            lighting: 'Natural light',
            audioNotes: scene.script ? scene.script[0] : 'Background music',
          })),
          capturedVideos: {},
          matchResults: {},
        };
        
        setRecipes([recipeData]);
      } catch (error) {
        console.error('Failed to fetch recipes:', error);
        // Fallback to mock data if API fails
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleView = (recipe: any) => {
    // Save recipe data to sessionStorage for viewing
    sessionStorage.setItem('recipeData', JSON.stringify({
      scenes: recipe.scenes,
      videoUrl: recipe.videoUrl,
      capturedVideos: recipe.capturedVideos || {},
      matchResults: recipe.matchResults || {},
      recipeId: recipe.id,
    }));
    
    // Navigate to Home with recipe view
    router.push('/home?view=recipe');
  };

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
          My Recipes <span className="text-2xl">📋</span>
        </h2>
        <p className="text-sm text-gray-600">Your analyzed video recipes</p>
      </div>

      {recipes.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Recipes Yet</h3>
          <p className="text-gray-600 mb-4">Create your first recipe from a viral video</p>
          <Link
            href="/paste"
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
          >
            Create Recipe
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {recipes.map((recipe) => (
            <Card key={recipe.id} className="group hover:shadow-xl transition-all p-0 overflow-hidden">
              {/* Thumbnail */}
              <div className="relative rounded-t-xl overflow-hidden aspect-[9/16]">
                <img
                  src={recipe.thumbnail}
                  alt={recipe.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="flex items-center gap-2 text-white text-xs">
                    <span className="bg-blue-600 px-2 py-1 rounded-lg font-bold">
                      🎬 {recipe.totalScenes} scenes
                    </span>
                    <span className="bg-green-600 px-2 py-1 rounded-lg font-bold">
                      ✓ {recipe.capturedCount}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3">
                {/* Title */}
                <h3 className="font-bold text-sm text-gray-900 mb-2 line-clamp-2">
                  {recipe.title}
                </h3>

                {/* Date */}
                <p className="text-xs text-gray-500 mb-3">
                  📅 {new Date(recipe.createdAt).toLocaleDateString()}
                </p>

                {/* View Button */}
                <button
                  onClick={() => handleView(recipe)}
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-sm font-bold hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
                >
                  View Recipe →
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// ============ SETTINGS / MY PAGE ============
export const Settings: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = React.useState<{
    email: string;
    username: string;
    subscriptionStatus: string;
    planType: string;
  } | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [likedVideos, setLikedVideos] = React.useState<any[]>([]);
  const [playingVideo, setPlayingVideo] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/signin');
          return;
        }

        const response = await fetch('/api/user/profile', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  // Load liked videos from localStorage
  React.useEffect(() => {
    const liked = JSON.parse(localStorage.getItem('likedVideos') || '[]');
    setLikedVideos(liked);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/signin');
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-1/2"></div>
        <div className="h-32 bg-gray-200 rounded-xl"></div>
        <div className="h-40 bg-gray-200 rounded-xl"></div>
        <div className="h-48 bg-gray-200 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
          My Page <span className="text-2xl">⚙️</span>
        </h2>
        <p className="text-sm text-gray-600">Manage your account and settings</p>
      </div>

      {/* Profile Card with Avatar */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-bl-full opacity-50"></div>
        <div className="relative">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg ring-4 ring-white">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-900 mb-0.5">{user?.username || 'User'}</h3>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-2.5 text-center border border-blue-200">
              <div className="text-lg font-bold text-blue-600">12</div>
              <div className="text-[10px] text-blue-700 font-medium">References</div>
            </div>
            <div className="flex-1 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-2.5 text-center border border-purple-200">
              <div className="text-lg font-bold text-purple-600">8</div>
              <div className="text-[10px] text-purple-700 font-medium">Recipes</div>
            </div>
            <div className="flex-1 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-2.5 text-center border border-pink-200">
              <div className="text-lg font-bold text-pink-600">2.5K</div>
              <div className="text-[10px] text-pink-700 font-medium">Views</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Subscription Card */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 opacity-5"></div>
        <div className="relative">
          <h3 className="font-bold text-base text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-lg">💎</span> Subscription
          </h3>
          <div className="flex items-center justify-between p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200">
            <div>
              <p className="text-xs text-gray-600 mb-1">Current Plan</p>
              <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {user?.planType === 'pro' ? 'Pro Plan ⭐' : 'Free Plan'}
              </p>
              <p className="text-[10px] text-gray-500 mt-1">
                {user?.planType === 'pro' ? 'All features unlocked' : 'Limited features'}
              </p>
            </div>
            {user?.planType === 'free' && (
              <Link
                href="/pricing"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-3 rounded-xl text-sm font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:scale-105"
              >
                Upgrade
              </Link>
            )}
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card>
        <h3 className="font-bold text-base text-gray-900 mb-3 flex items-center gap-2">
          <span className="text-lg">⚡</span> Quick Actions
        </h3>
        <div className="space-y-2">
          <Link
            href="/pricing"
            className="flex items-center justify-between w-full px-4 py-3.5 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-all border border-blue-100 hover:border-blue-200 group"
          >
            <span className="flex items-center gap-2.5 text-sm font-bold text-gray-900">
              <span className="text-xl">💳</span> View Pricing
            </span>
            <span className="text-gray-400 group-hover:text-blue-600 transition-colors">→</span>
          </Link>
          <Link
            href="/interests"
            className="flex items-center justify-between w-full px-4 py-3.5 rounded-xl bg-gradient-to-r from-pink-50 to-purple-50 hover:from-pink-100 hover:to-purple-100 transition-all border border-pink-100 hover:border-pink-200 group"
          >
            <span className="flex items-center gap-2.5 text-sm font-bold text-gray-900">
              <span className="text-xl">🎨</span> Manage Interests
            </span>
            <span className="text-gray-400 group-hover:text-pink-600 transition-colors">→</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center justify-between w-full px-4 py-3.5 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 hover:from-red-100 hover:to-orange-100 transition-all border border-red-100 hover:border-red-200 group"
          >
            <span className="flex items-center gap-2.5 text-sm font-bold text-red-600">
              <span className="text-xl">🚪</span> Log Out
            </span>
            <span className="text-red-300 group-hover:text-red-600 transition-colors">→</span>
          </button>
        </div>
      </Card>

      {/* Liked Videos */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <span>❤️</span> Liked Videos
            <span className="text-sm text-gray-500">({likedVideos.length})</span>
          </h3>
        </div>
        
        {likedVideos.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💔</div>
            <p className="text-gray-500 mb-2">No liked videos yet</p>
            <p className="text-sm text-gray-400">Go to Explore and like some videos!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {likedVideos.map((video: any) => (
              <div
                key={video.id}
                className="relative cursor-pointer group"
                onClick={() => setPlayingVideo(video.videoId)}
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full aspect-[9/16] object-cover rounded-xl border-2 border-gray-200 group-hover:border-pink-400 transition-all group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-xl transition-all flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-2xl">▶️</span>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm font-semibold text-gray-900 line-clamp-2">{video.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">{video.creator}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-pink-600">❤️ {video.likes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

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

// 기존 컴포넌트들 (호환성 유지)
export const Projects: React.FC = () => <Recipes />;
export const Templates: React.FC = () => <Recipes />;
export const AIAssistant: React.FC = () => <Settings />;
