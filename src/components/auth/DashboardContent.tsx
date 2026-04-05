'use client';

import React from 'react';
import { Card, RecipeResult, ShortVideoCard } from '@/components/common';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  authenticatedFetch,
  clearClientSession,
  ensureValidAccessToken,
  readAccessToken,
  readRefreshToken,
} from '@/lib/auth/client-session';
import { logClientEvent } from '@/lib/client-events';
import {
  ONBOARDING_PROFILE_DEFAULTS,
  OnboardingProfileExtras,
} from '@/types/auth';
import {
  isOnboardingProfileExtrasComplete,
  readOnboardingProfileExtras,
  saveOnboardingProfileExtras,
} from '@/lib/onboarding-profile';
import { PASTE_DRAWER_HOME_HREF } from '@/lib/paste-drawer';
import { normalizeBrandBrief, normalizeRecipeScenes } from '@/lib/recipe-scene';
import type { BrandBrief, RecipeScene, RecipeViewData } from '@/types/recipe';
import { CreatorProfileFields } from './CreatorProfileFields';

type RecipeApiItem = {
  id: string;
  title?: string | null;
  video_url: string;
  scenes: RecipeScene[];
  brandBrief?: BrandBrief | null;
  analysis_metadata?: Record<string, unknown> | null;
  captured_scene_ids?: number[] | null;
  match_results?: Record<string, boolean> | null;
  total_scenes?: number | null;
  captured_count?: number | null;
  created_at?: string | null;
};

type RecentReference = {
  id: number;
  videoId: string;
  thumbnail: string;
  title: string;
  creator: string;
  duration: string;
  views: string;
  createdAt: string;
};

type LikedVideo = {
  id: string;
  videoId: string;
  thumbnail: string;
  title: string;
  creator: string;
  likes: string;
};

type SettingsStats = {
  references: number;
  recipes: number;
  views: number;
};

function buildCapturedMap(sceneIds: number[] | null | undefined): Record<number, boolean> {
  return Array.isArray(sceneIds)
    ? sceneIds.reduce((acc: Record<number, boolean>, sceneId) => {
        acc[sceneId] = true;
        return acc;
      }, {})
    : {};
}

function parseRecipeDataFromSession(raw: string): RecipeViewData | null {
  try {
    const parsed = JSON.parse(raw) as Partial<RecipeViewData>;
    if (!parsed || !Array.isArray(parsed.scenes) || typeof parsed.videoUrl !== 'string') {
      return null;
    }

    return {
      scenes: normalizeRecipeScenes(parsed.scenes, normalizeBrandBrief(parsed.brandBrief)),
      videoUrl: parsed.videoUrl,
      capturedVideos: parsed.capturedVideos || {},
      matchResults: parsed.matchResults || {},
      recipeId: parsed.recipeId || '',
      metadata: parsed.metadata || {},
      transcript: parsed.transcript || [],
      brandBrief: normalizeBrandBrief(parsed.brandBrief),
      analysisMetadata: parsed.analysisMetadata || {},
    };
  } catch {
    return null;
  }
}

function parseLikedVideos(raw: string | null): LikedVideo[] {
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
      .map((item, index) => ({
        id: String(item.id ?? index),
        videoId: String(item.videoId ?? ''),
        thumbnail: String(item.thumbnail ?? ''),
        title: String(item.title ?? ''),
        creator: String(item.creator ?? ''),
        likes: String(item.likes ?? '0'),
      }))
      .filter((item) => item.videoId.length > 0);
  } catch {
    return [];
  }
}

const compactNumberFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

function formatCompactCount(value: number): string {
  const safeValue = Number.isFinite(value) ? Math.max(0, value) : 0;
  return compactNumberFormatter.format(safeValue);
}

function parseStatCount(value: unknown): number {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? Math.max(0, numericValue) : 0;
}

const brandActionGradientClass =
  'text-white hover:scale-[1.02]';
const brandActionGradientStyle: React.CSSProperties = {
  backgroundImage: 'var(--gradient-brand-action)',
  boxShadow: 'var(--shadow-brand-action-lg)',
};

// ============ HOME: 최근 Paste한 레퍼런스들 ============
export const Home: React.FC = () => {
  const searchParams = useSearchParams() || null;
  const router = useRouter();
  const [recentReferences, setRecentReferences] = React.useState<RecentReference[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [recipeData, setRecipeData] = React.useState<RecipeViewData | null>(null);
  const [playingVideo, setPlayingVideo] = React.useState<string | null>(null);
  const recipeViewMode = searchParams?.get('view') || null;
  const recipeIdParam = searchParams?.get('recipeId') || null;
  const shouldUseRecipeFullscreen = Boolean(recipeData) || recipeViewMode === 'recipe';

  // Check for recipe view
  React.useEffect(() => {
    const loadRecipeData = async () => {
      try {
        if (recipeViewMode !== 'recipe') {
          setRecipeData(null);
          return;
        }

        const data = sessionStorage.getItem('recipeData');
        if (data) {
          const parsed = parseRecipeDataFromSession(data);
          if (parsed) {
            setRecipeData(parsed);
            return;
          }
        }

        const token = await ensureValidAccessToken();
        if (!recipeIdParam || !token) {
          return;
        }

        const response = await authenticatedFetch(`/api/recipes/${recipeIdParam}`);

        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as { recipe?: RecipeApiItem };
        const recipe = payload.recipe;
        if (!recipe || !Array.isArray(recipe.scenes) || !recipe.video_url || !recipe.id) {
          return;
        }

        const hydrated: RecipeViewData = {
          scenes: normalizeRecipeScenes(
            recipe.scenes,
            normalizeBrandBrief(recipe.brandBrief || recipe.analysis_metadata?.brandBrief)
          ),
          videoUrl: recipe.video_url,
          capturedVideos: buildCapturedMap(recipe.captured_scene_ids),
          matchResults: recipe.match_results || {},
          recipeId: recipe.id,
          brandBrief: normalizeBrandBrief(recipe.brandBrief || recipe.analysis_metadata?.brandBrief),
          analysisMetadata: recipe.analysis_metadata || {},
        };

        setRecipeData(hydrated);
        sessionStorage.setItem('recipeData', JSON.stringify(hydrated));
      } catch (error) {
        console.error('Error loading recipe data:', error);
      }
    };

    void loadRecipeData();
  }, [recipeIdParam, recipeViewMode]);

  React.useEffect(() => {
    const fetchRecentReferences = async () => {
      try {
        // YouTube Shorts Reference - Pasted videos
        const mockData: RecentReference[] = [
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

  React.useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const fullscreenClassName = 'recipe-fullscreen-mode';

    if (shouldUseRecipeFullscreen) {
      document.body.classList.add(fullscreenClassName);
    } else {
      document.body.classList.remove(fullscreenClassName);
    }

    return () => {
      document.body.classList.remove(fullscreenClassName);
    };
  }, [shouldUseRecipeFullscreen]);

  // Handle back from recipe view
  const handleBackFromRecipe = () => {
    sessionStorage.removeItem('recipeData');
    setRecipeData(null);
    router.push('/home');
  };

  // Show recipe result if available
  if (recipeData) {
    return (
      <div className="fixed inset-0 z-[9999] bg-white">
        <RecipeResult
          scenes={recipeData.scenes}
          videoUrl={recipeData.videoUrl}
          onBack={handleBackFromRecipe}
          recipeId={recipeData.recipeId}
          initialCapturedVideos={recipeData.capturedVideos}
          initialMatchResults={recipeData.matchResults}
          brandBrief={recipeData.brandBrief || null}
          analysisMetadata={recipeData.analysisMetadata || recipeData.metadata}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="mb-4 inline-block">
          <img src="/parrot-logo.png" alt="Loading" className="w-16 h-16 animate-bounce-logo" />
        </div>
        <h3 className="text-base font-bold text-gray-900 mb-1.5">Loading your workspace...</h3>
        <p className="text-xs text-gray-600 font-medium">
          Preparing your creative space
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
          Welcome! <span className="animate-bounce">👋</span>
        </h2>
        <p className="text-sm text-gray-900 font-medium">Your creative workspace</p>
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
            href={PASTE_DRAWER_HOME_HREF}
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
              <p className="text-xs text-gray-900 font-medium mb-4">Start by pasting your first viral video URL</p>
              <Link
                href={PASTE_DRAWER_HOME_HREF}
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
  const [recipes, setRecipes] = React.useState<RecipeApiItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [openMenuRecipeId, setOpenMenuRecipeId] = React.useState<string | null>(null);
  const [processingRecipeId, setProcessingRecipeId] = React.useState<string | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const token = await ensureValidAccessToken();
        if (!token) {
          router.push('/signin');
          return;
        }

        const response = await authenticatedFetch('/api/recipes');

        if (!response.ok) {
          throw new Error('Failed to fetch recipes');
        }

        const data = (await response.json()) as { recipes?: RecipeApiItem[] };
        setRecipes(Array.isArray(data.recipes) ? data.recipes : []);
      } catch (error) {
        console.error('Failed to fetch recipes:', error);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    void fetchRecipes();
  }, [router]);

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

  const handleView = (recipe: RecipeApiItem) => {
    setOpenMenuRecipeId(null);

    // Save recipe data to sessionStorage for viewing
    sessionStorage.setItem('recipeData', JSON.stringify({
      scenes: normalizeRecipeScenes(
        recipe.scenes,
        normalizeBrandBrief(recipe.brandBrief || recipe.analysis_metadata?.brandBrief)
      ),
      videoUrl: recipe.video_url,
      capturedVideos: buildCapturedMap(recipe.captured_scene_ids),
      matchResults: recipe.match_results || {},
      recipeId: recipe.id,
      brandBrief: normalizeBrandBrief(recipe.brandBrief || recipe.analysis_metadata?.brandBrief),
      analysisMetadata: recipe.analysis_metadata || {},
    }));

    void logClientEvent('recipe_reopened', { recipe_id: recipe.id });
    
    // Navigate to Home with recipe view
    router.push(`/home?view=recipe&recipeId=${recipe.id}`);
  };

  const getRecipeDisplayTitle = (recipe: RecipeApiItem) => {
    const sceneFallbackTitle = recipe.scenes?.[0]?.title?.trim() || 'Untitled Recipe';
    return recipe.title?.trim() || sceneFallbackTitle;
  };

  const handleEditRecipeTitle = async (recipe: RecipeApiItem) => {
    const currentTitle = getRecipeDisplayTitle(recipe);
    const nextTitleInput = window.prompt('Edit recipe title', currentTitle);

    if (nextTitleInput === null) {
      return;
    }

    const nextTitle = nextTitleInput.trim();
    if (!nextTitle) {
      alert('Title cannot be empty.');
      return;
    }

    if (nextTitle.length > 80) {
      alert('Title must be 80 characters or fewer.');
      return;
    }

    try {
      const token = await ensureValidAccessToken();
      if (!token) {
        router.push('/signin');
        return;
      }

      setProcessingRecipeId(recipe.id);

      const response = await authenticatedFetch(`/api/recipes/${recipe.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: nextTitle }),
      });

      if (!response.ok) {
        throw new Error('Failed to update title');
      }

      setRecipes((prev) =>
        prev.map((item) =>
          item.id === recipe.id
            ? {
                ...item,
                title: nextTitle,
              }
            : item
        )
      );
      setOpenMenuRecipeId(null);
    } catch (error) {
      console.error('Failed to update recipe title:', error);
      alert('Failed to update title. Please try again.');
    } finally {
      setProcessingRecipeId(null);
    }
  };

  const handleDeleteRecipe = async (recipe: RecipeApiItem) => {
    if (!window.confirm('Delete this recipe? This action cannot be undone.')) {
      return;
    }

    try {
      const token = await ensureValidAccessToken();
      if (!token) {
        router.push('/signin');
        return;
      }

      setProcessingRecipeId(recipe.id);

      const response = await authenticatedFetch(`/api/recipes/${recipe.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete recipe');
      }

      setRecipes((prev) => prev.filter((item) => item.id !== recipe.id));
      setOpenMenuRecipeId(null);
    } catch (error) {
      console.error('Failed to delete recipe:', error);
      alert('Failed to delete recipe. Please try again.');
    } finally {
      setProcessingRecipeId(null);
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="mb-4 inline-block">
          <img src="/parrot-logo.png" alt="Loading" className="w-16 h-16 animate-bounce-logo" />
        </div>
        <p className="text-gray-600 font-semibold">Loading recipes...</p>
      </div>
    );
  }

  return (
    <div
      className="space-y-5"
      onClick={() => setOpenMenuRecipeId(null)}
    >
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
            href={PASTE_DRAWER_HOME_HREF}
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
          >
            Create Recipe
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {recipes.map((recipe) => {
            const videoId = extractVideoId(recipe.video_url || '');
            const thumbnailUrl =
              recipe.scenes?.[0]?.thumbnail ||
              (videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '/parrot-logo.png');
            const formattedDate = recipe.created_at
              ? new Date(recipe.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              : '-';
            const shortRecipeId = recipe.id.split('-')[0];
            const displayTitle = getRecipeDisplayTitle(recipe);
            const displaySubtitle = formattedDate === '-' ? `Recipe #${shortRecipeId}` : `Saved ${formattedDate}`;
            const isMenuOpen = openMenuRecipeId === recipe.id;
            const isProcessing = processingRecipeId === recipe.id;

            return (
              <ShortVideoCard
                key={recipe.id}
                thumbnail={thumbnailUrl}
                thumbnailAlt={`Recipe ${recipe.id}`}
                title={displayTitle}
                subtitle={displaySubtitle}
                onPreview={() => handleView(recipe)}
                onAction={() => handleView(recipe)}
                actionLabel="View Recipe"
                actionIcon={<span>👁️</span>}
                actionClassName={`${brandActionGradientClass} hover:scale-105`}
                actionStyle={brandActionGradientStyle}
                topLeftBadge={(
                  <span className="bg-gradient-to-r from-green-600 to-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                    <span className="animate-pulse">📋</span> RECIPE
                  </span>
                )}
                topRightBadge={(
                  <div
                    className="relative"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={(event) => {
                        event.stopPropagation();
                        if (isProcessing) {
                          return;
                        }
                        setOpenMenuRecipeId((prev) => (prev === recipe.id ? null : recipe.id));
                      }}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          event.stopPropagation();
                          if (isProcessing) {
                            return;
                          }
                          setOpenMenuRecipeId((prev) => (prev === recipe.id ? null : recipe.id));
                        }
                      }}
                      className={`w-8 h-8 rounded-full bg-black/70 backdrop-blur-sm text-white text-lg leading-none flex items-center justify-center ${
                        isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black/85'
                      }`}
                      aria-label="Open recipe menu"
                    >
                      ⋯
                    </div>

                    {isMenuOpen ? (
                      <div className="absolute right-0 mt-1 min-w-[128px] rounded-xl border border-white/20 bg-black/90 backdrop-blur-md p-1 z-20 shadow-2xl">
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={(event) => {
                            event.stopPropagation();
                            if (isProcessing) {
                              return;
                            }
                            void handleEditRecipeTitle(recipe);
                          }}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              event.stopPropagation();
                              if (isProcessing) {
                                return;
                              }
                              void handleEditRecipeTitle(recipe);
                            }
                          }}
                          className="px-3 py-2 text-xs font-semibold text-white rounded-lg hover:bg-white/15"
                        >
                          ✏️ Edit title
                        </div>
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={(event) => {
                            event.stopPropagation();
                            if (isProcessing) {
                              return;
                            }
                            void handleDeleteRecipe(recipe);
                          }}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              event.stopPropagation();
                              if (isProcessing) {
                                return;
                              }
                              void handleDeleteRecipe(recipe);
                            }
                          }}
                          className="px-3 py-2 text-xs font-semibold text-red-300 rounded-lg hover:bg-red-500/20"
                        >
                          🗑 Delete
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}
                leftMetric={{
                  icon: <span>🎬</span>,
                  value: `${recipe.total_scenes || 0} scenes`,
                }}
                rightMetric={{
                  icon: <span className="text-green-400">✓</span>,
                  value: recipe.captured_count || 0,
                }}
                fallbackContent={(
                  <div className="w-full h-full bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center">
                    <div className="text-white text-4xl">🎥</div>
                  </div>
                )}
              />
            );
          })}
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
  const [stats, setStats] = React.useState<SettingsStats>({
    references: 0,
    recipes: 0,
    views: 0,
  });
  const [loading, setLoading] = React.useState(true);
  const [likedVideos, setLikedVideos] = React.useState<LikedVideo[]>([]);
  const [playingVideo, setPlayingVideo] = React.useState<string | null>(null);
  const [profileExtras, setProfileExtras] = React.useState<OnboardingProfileExtras>({
    ...ONBOARDING_PROFILE_DEFAULTS,
  });
  const [profileEditorDraft, setProfileEditorDraft] = React.useState<OnboardingProfileExtras>({
    ...ONBOARDING_PROFILE_DEFAULTS,
  });
  const [isProfileEditorOpen, setIsProfileEditorOpen] = React.useState(false);
  const [profileEditorError, setProfileEditorError] = React.useState('');
  const hasCompleteProfileExtras = isOnboardingProfileExtrasComplete(profileExtras);

  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await ensureValidAccessToken();
        if (!token) {
          router.push('/signin');
          return;
        }

        const response = await authenticatedFetch('/api/user/profile');

        if (response.ok) {
          const data = (await response.json()) as {
            user?: {
              email: string;
              username: string;
              subscriptionStatus: string;
              planType: string;
            };
            stats?: Partial<SettingsStats>;
          };

          if (data.user) {
            setUser(data.user);
          }

          setStats({
            references: parseStatCount(data.stats?.references),
            recipes: parseStatCount(data.stats?.recipes),
            views: parseStatCount(data.stats?.views),
          });
        } else if (response.status === 401) {
          clearClientSession();
          router.replace('/signin');
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
    setLikedVideos(parseLikedVideos(localStorage.getItem('likedVideos')));
    const storedProfile = readOnboardingProfileExtras();
    setProfileExtras(storedProfile);
    setProfileEditorDraft(storedProfile);
  }, []);

  const openProfileEditor = () => {
    setProfileEditorDraft(profileExtras);
    setProfileEditorError('');
    setIsProfileEditorOpen(true);
  };

  const handleProfileDraftChange = (
    field: keyof OnboardingProfileExtras,
    value: string
  ) => {
    setProfileEditorDraft((prev) => ({
      ...prev,
      [field]: value,
    }));
    setProfileEditorError('');
  };

  const handleSaveProfileExtras = () => {
    if (!isOnboardingProfileExtrasComplete(profileEditorDraft)) {
      setProfileEditorError('Please complete every creator profile field before saving.');
      return;
    }

    saveOnboardingProfileExtras(profileEditorDraft);
    setProfileExtras(profileEditorDraft);
    setIsProfileEditorOpen(false);
  };

  const handleLogout = async () => {
    const accessToken = readAccessToken();
    const refreshToken = readRefreshToken();

    try {
      await fetch('/api/auth/signout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken,
          refreshToken,
        }),
      });
    } catch {
      // Ignore signout API failures and continue local cleanup.
    }

    clearClientSession();
    router.push('/signin');
  };

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="mb-4 inline-block">
          <img src="/parrot-logo.png" alt="Loading" className="w-16 h-16 animate-bounce-logo" />
        </div>
        <h3 className="text-base font-bold text-gray-900 mb-1.5">Loading your profile...</h3>
        <p className="text-xs text-gray-600 font-medium">
          Please wait a moment
        </p>
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
        <p className="text-sm text-gray-900 font-semibold">Manage your account and settings</p>
      </div>

      {/* Profile Card with Avatar */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-bl-full opacity-50"></div>
        <div
          role="button"
          tabIndex={0}
          onClick={openProfileEditor}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              openProfileEditor();
            }
          }}
          className="relative cursor-pointer rounded-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--brand-focus-ring)]"
          aria-label="Edit creator profile details"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg ring-4 ring-white">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-900 mb-0.5">{user?.username || 'User'}</h3>
              <p className="text-sm text-gray-900 font-semibold">{user?.email}</p>
            </div>
            <span
              className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 text-gray-500 flex items-center justify-center text-lg"
              aria-hidden="true"
            >
              ›
            </span>
          </div>

          <div className="flex gap-2">
            <div className="flex-1 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-2.5 text-center border border-blue-200">
              <div className="text-lg font-bold text-blue-600">{formatCompactCount(stats.references)}</div>
              <div className="text-[10px] text-blue-700 font-medium">References</div>
            </div>
            <div className="flex-1 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-2.5 text-center border border-purple-200">
              <div className="text-lg font-bold text-purple-600">{formatCompactCount(stats.recipes)}</div>
              <div className="text-[10px] text-purple-700 font-medium">Recipes</div>
            </div>
            <div className="flex-1 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-2.5 text-center border border-pink-200">
              <div className="text-lg font-bold text-pink-600">{formatCompactCount(stats.views)}</div>
              <div className="text-[10px] text-pink-700 font-medium">Views</div>
            </div>
          </div>

          <div className="mt-4 rounded-[1.25rem] border border-white/80 bg-white/80 p-3.5 shadow-sm">
            {hasCompleteProfileExtras ? (
              <>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-sm font-bold tracking-[-0.02em] text-gray-900">Creator profile</p>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700">
                    Ready
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[profileExtras.ageGroup, profileExtras.gender, profileExtras.domain, profileExtras.followerRange, profileExtras.activityPurpose].map((item, index) => (
                    <span
                      key={`${item}-${index}`}
                      className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold tracking-[-0.02em] text-gray-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="mb-2 inline-flex rounded-full border border-[var(--brand-soft-border)] bg-white px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--brand-orchid-pink)]">
                    Recommended
                  </div>
                  <p className="text-sm font-bold tracking-[-0.02em] text-gray-900">
                    Complete your creator profile
                  </p>
                  <p className="mt-1 text-xs font-medium leading-5 text-gray-600">
                    Add your creator details to sharpen recommendations without changing your current access.
                  </p>
                </div>
                <span className="brand-gradient-action rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white shadow-sm">
                  Update
                </span>
              </div>
            )}
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

      {/* Liked Videos */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
            <span className="text-lg text-gray-900">❤️</span>
            <span className="text-gray-900">Liked Videos</span>
            <span className="text-sm font-semibold text-gray-900">({likedVideos.length})</span>
          </h3>
        </div>
        
        {likedVideos.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💔</div>
            <p className="text-gray-900 font-semibold mb-2">No liked videos yet</p>
            <p className="text-sm text-gray-900 font-medium">Go to Explore and like some videos!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {likedVideos.map((video) => (
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
                    <span className="text-xs text-gray-900 font-semibold">{video.creator}</span>
                    <span className="text-xs text-gray-900">•</span>
                    <span className="text-xs text-pink-600 font-semibold">❤️ {video.likes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Quick Actions */}
      <Card>
        <h3 className="font-bold text-base text-gray-900 mb-3 flex items-center gap-2">
          <span className="text-lg">⚡</span> Quick Actions
        </h3>
        <div className="space-y-2">
          <Link
            href="/faq"
            className="flex items-center justify-between w-full px-4 py-3.5 rounded-xl bg-gradient-to-r from-amber-50 via-rose-50 to-violet-50 hover:from-amber-100 hover:via-rose-100 hover:to-violet-100 transition-all border border-orange-100 hover:border-rose-200 group"
          >
            <span className="flex items-center gap-2.5 text-sm font-bold text-gray-900">
              <span className="text-xl">❓</span> View FAQ
            </span>
            <span className="text-gray-400 group-hover:text-rose-500 transition-colors">→</span>
          </Link>
          <Link
            href="/pricing"
            className="flex items-center justify-between w-full px-4 py-3.5 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-all border border-blue-100 hover:border-blue-200 group"
          >
            <span className="flex items-center gap-2.5 text-sm font-bold text-gray-900">
              <span className="text-xl">💳</span> View Pricing
            </span>
            <span className="text-gray-400 group-hover:text-fuchsia-500 transition-colors">→</span>
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

      {isProfileEditorOpen ? (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998] flex items-end sm:items-center justify-center p-3 sm:p-4"
          onClick={() => setIsProfileEditorOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-2xl p-5 sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Edit creator profile</h3>
              <button
                type="button"
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold"
                onClick={() => setIsProfileEditorOpen(false)}
                aria-label="Close profile editor"
              >
                ×
              </button>
            </div>

            <CreatorProfileFields
              profile={profileEditorDraft}
              onChange={handleProfileDraftChange}
              domainSuggestionsId="profile-domain-suggestions"
            />

            {profileEditorError ? (
              <p className="brand-inline-error mt-4">{profileEditorError}</p>
            ) : null}

            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsProfileEditorOpen(false)}
                className="rounded-xl border-2 border-gray-300 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProfileExtras}
                className="brand-primary-button rounded-xl py-2.5 text-sm font-bold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}

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
