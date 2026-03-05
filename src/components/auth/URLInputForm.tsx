'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, LoadingScreen } from '@/components/common';
import { logClientEvent } from '@/lib/client-events';

export const URLInputForm: React.FC = () => {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [niche, setNiche] = useState('');
  const [goal, setGoal] = useState('');
  const [describe, setDescribe] = useState('');
  const [loading, setLoading] = useState(false);

  // 로그인 체크
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/signin');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      alert('URL을 입력해주세요.');
      return;
    }

    await logClientEvent('reference_submitted', {
      event_category: 'engagement',
      event_label: 'video_url_submission',
      source_url: url,
    });

    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/signin');
        return;
      }

      // API 호출 - 비디오 분석
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, niche, goal, description: describe }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze video');
      }

      const data = await response.json();
      await logClientEvent('recipe_generated', {
        source_url: url,
        scenes_count: Array.isArray(data.scenes) ? data.scenes.length : 0,
      });

      let recipeId: string | null = null;
      try {
        const saveResponse = await fetch('/api/recipes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            videoUrl: url,
            scenes: data.scenes,
            niche,
            goal,
            description: describe,
            platform: data?.metadata?.platform || null,
            videoId: data.videoId || null,
          }),
        });

        if (saveResponse.ok) {
          const saveData = await saveResponse.json();
          recipeId = saveData?.recipe?.id || null;
          await logClientEvent('recipe_saved', {
            recipe_id: recipeId || 'unknown',
          });
        }
      } catch (saveError) {
        console.error('Recipe save warning:', saveError);
      }
      
      // 레시피 데이터를 sessionStorage에 저장
      sessionStorage.setItem('recipeData', JSON.stringify({
        scenes: data.scenes,
        videoUrl: url,
        capturedVideos: {},
        matchResults: {},
        recipeId,
      }));

      // Home 탭으로 이동하여 레시피 표시
      router.push(recipeId ? `/home?view=recipe&recipeId=${recipeId}` : '/home?view=recipe');
    } catch (error) {
      console.error('URL submit error:', error);
      alert('비디오 분석에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen message="Creating video recipe..." />;
  }

  return (
    <Card className="w-full">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="text-5xl mb-4">🎬</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Paste Reference</h2>
          <p className="text-gray-900">Paste a viral video URL from TikTok, Instagram, or YouTube Shorts</p>
        </div>

        {/* URL Input */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Video URL *
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.tiktok.com/@username/video/..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Niche (Optional)
            </label>
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="e.g., Cooking, Fitness, Beauty..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Goal (Optional)
            </label>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="What do you want to achieve with this recipe?"
              className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl text-base focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-white text-gray-900 placeholder-gray-500 font-medium shadow-sm"
              disabled={loading}
              autoComplete="off"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Describe (Optional)
            </label>
            <textarea
              value={describe}
              onChange={(e) => setDescribe(e.target.value)}
              placeholder="Additional notes or specific requirements..."
              rows={3}
              className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl text-base focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 resize-none bg-white text-gray-900 placeholder-gray-500 font-medium shadow-sm"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {loading ? 'Analyzing...' : 'Analyze Video'}
          </button>
        </form>

        {/* Info */}
        <div className="text-center text-sm text-gray-900">
          <p>💡 We&apos;ll analyze the video and create a recipe for you</p>
        </div>
      </div>
    </Card>
  );
};
