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
        // TODO: API 연결 시 실제 데이터 가져오기
        const mockData = [
          {
            id: 1,
            thumbnail: 'https://via.placeholder.com/300x400/ec4899/ffffff?text=Recipe+1',
            title: 'Viral Cooking Recipe',
            duration: '00:25',
            views: '5.4K',
            createdAt: '2 hours ago',
          },
          {
            id: 2,
            thumbnail: 'https://via.placeholder.com/300x400/8b5cf6/ffffff?text=Recipe+2',
            title: 'Beauty Tutorial',
            duration: '00:30',
            views: '6.6K',
            createdAt: '5 hours ago',
          },
          {
            id: 3,
            thumbnail: 'https://via.placeholder.com/300x400/f97316/ffffff?text=Recipe+3',
            title: 'Fitness Tips',
            duration: '00:35',
            views: '7.8K',
            createdAt: '1 day ago',
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
      <div className="py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Welcome Back! 👋</h2>
        <p className="text-sm text-gray-600">Your recent references and recipes</p>
      </div>

      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold mb-1">Create New Recipe</h3>
            <p className="text-xs text-blue-100">Paste a viral video URL to get started</p>
          </div>
          <Link
            href="/paste"
            className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors"
          >
            + Add
          </Link>
        </div>
      </Card>

      <div>
        <h3 className="text-base font-bold text-gray-900 mb-3">Recent References</h3>
        
        {recentReferences.length === 0 ? (
          <Card className="text-center py-12">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No References Yet</h3>
            <p className="text-gray-600 mb-4">Start by pasting your first viral video URL</p>
            <Link
              href="/paste"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Add Reference
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {recentReferences.map((ref) => (
              <Link
                key={ref.id}
                href={`/recipes?id=${ref.id}`}
                className="block group"
              >
                <div className="relative rounded-xl overflow-hidden shadow-md aspect-[9/16]">
                  <img
                    src={ref.thumbnail}
                    alt={ref.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                    <div className="flex items-center justify-between text-white text-xs mb-1">
                      <span className="bg-black/50 px-1.5 py-0.5 rounded text-[10px]">{ref.duration}</span>
                      <span className="flex items-center gap-0.5 text-[10px]">
                        <span className="text-red-500">❤</span> {ref.views}
                      </span>
                    </div>
                    <p className="text-white font-semibold text-xs line-clamp-1">{ref.title}</p>
                    <p className="text-gray-300 text-[10px]">{ref.createdAt}</p>
                  </div>
                </div>
              </Link>
            ))}
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

  React.useEffect(() => {
    const fetchRecipes = async () => {
      try {
        // TODO: API 연결
        const mockData = [
          { id: 1, title: 'Cooking Recipe #1', scenes: 5, createdAt: '2 days ago' },
          { id: 2, title: 'Beauty Tutorial', scenes: 7, createdAt: '3 days ago' },
          { id: 3, title: 'Fitness Tips', scenes: 6, createdAt: '1 week ago' },
        ];
        setRecipes(mockData);
      } catch (error) {
        console.error('Failed to fetch recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">My Recipes 📋</h2>
        <p className="text-sm text-gray-600">All your created recipes</p>
      </div>

      {recipes.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Recipes Yet</h3>
          <p className="text-gray-600 mb-4">Create your first recipe from a viral video</p>
          <Link
            href="/paste"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Create Recipe
          </Link>
        </Card>
      ) : (
        <div className="space-y-2">
          {recipes.map((recipe) => (
            <Card key={recipe.id} className="hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-0.5">{recipe.title}</h3>
                  <p className="text-xs text-gray-600">{recipe.scenes} scenes • {recipe.createdAt}</p>
                </div>
                <Link
                  href={`/recipes?id=${recipe.id}`}
                  className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                >
                  View →
                </Link>
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/signin');
  };

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">My Page ⚙️</h2>
        <p className="text-sm text-gray-600">Manage your account and settings</p>
      </div>

      {/* Profile Card */}
      <Card>
        <h3 className="font-semibold text-gray-900 text-base mb-3">Profile</h3>
        <div className="space-y-2">
          <div>
            <p className="text-xs text-gray-600">Username</p>
            <p className="font-medium text-gray-900 text-sm">{user?.username || 'User'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Email</p>
            <p className="font-medium text-gray-900 text-sm">{user?.email}</p>
          </div>
        </div>
      </Card>

      {/* Subscription Card */}
      <Card>
        <h3 className="font-semibold text-gray-900 text-base mb-3">Subscription</h3>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="text-xs text-gray-600">Current Plan</p>
            <p className="text-lg font-bold text-gray-900 capitalize">
              {user?.planType === 'pro' ? 'Pro Plan ⭐' : 'Free Plan'}
            </p>
          </div>
          {user?.planType === 'free' && (
            <Link
              href="/pricing"
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90"
            >
              Upgrade
            </Link>
          )}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card>
        <h3 className="font-semibold text-gray-900 text-base mb-3">Quick Actions</h3>
        <div className="space-y-1">
          <Link
            href="/pricing"
            className="block w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            💳 View Pricing
          </Link>
          <Link
            href="/interests"
            className="block w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            🎨 Manage Interests
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-3 py-2.5 rounded-lg hover:bg-red-50 text-red-600 font-semibold transition-colors text-sm"
          >
            🚪 Log Out
          </button>
        </div>
      </Card>
    </div>
  );
};

// 기존 컴포넌트들 (호환성 유지)
export const Projects: React.FC = () => <Recipes />;
export const Templates: React.FC = () => <Recipes />;
export const AIAssistant: React.FC = () => <Settings />;
