'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, LoadingScreen } from '@/components/common';
import { authenticatedFetch, ensureValidAccessToken } from '@/lib/auth/client-session';
import { logClientEvent } from '@/lib/client-events';

export const URLInputForm: React.FC = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [niche, setNiche] = useState('');
  const [goal, setGoal] = useState('');
  const [describe, setDescribe] = useState('');
  const [loading, setLoading] = useState(false);
  const brandActionClass =
    'w-full rounded-xl px-8 py-4 font-semibold text-white transition-all hover:translate-y-[-1px] hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50';
  const brandActionStyle: React.CSSProperties = {
    backgroundImage: 'linear-gradient(135deg, #ff9568 0%, #de81c1 52%, #8c67ff 100%)',
    boxShadow: '0 14px 30px rgba(140, 103, 255, 0.22)',
  };

  // 로그인 체크
  useEffect(() => {
    void (async () => {
      const token = await ensureValidAccessToken();
      if (!token) {
        router.push('/signin');
      }
    })();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('레시피 제목을 입력해주세요.');
      return;
    }
    
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
      const token = await ensureValidAccessToken();
      if (!token) {
        router.push('/signin');
        return;
      }

      // API 호출 - 비디오 분석
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), url, niche, goal, description: describe }),
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
        const saveResponse = await authenticatedFetch('/api/recipes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: title.trim(),
            videoUrl: url,
            scenes: data.scenes,
            niche,
            goal,
            description: describe,
            platform: data?.metadata?.platform || null,
            videoId: data.videoId || null,
            transcript: data.transcript || [],
            transcriptSource: data?.metadata?.transcriptSource || 'none',
            transcriptLanguage: data?.metadata?.transcriptLanguage || null,
            sourceMetadata: data?.metadata?.sourceMetadata || {},
            analysisMetadata: data?.metadata || {},
            scriptSource: data?.metadata?.scriptSource || 'default',
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
        metadata: data.metadata || {},
        transcript: data.transcript || [],
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
              Recipe Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Korean Diet Viral Hook"
              className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-base font-medium text-gray-900 placeholder:text-slate-400 focus:border-fuchsia-300 focus:outline-none focus:ring-4 focus:ring-fuchsia-100"
              disabled={loading}
              required
              maxLength={80}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Video URL *
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.tiktok.com/@username/video/..."
              className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-base font-medium text-gray-900 placeholder:text-slate-400 focus:border-fuchsia-300 focus:outline-none focus:ring-4 focus:ring-fuchsia-100"
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
              className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-base font-medium text-gray-900 placeholder:text-slate-400 focus:border-fuchsia-300 focus:outline-none focus:ring-4 focus:ring-fuchsia-100"
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
              className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-4 text-base font-medium text-gray-900 shadow-sm placeholder:text-slate-400 focus:border-fuchsia-300 focus:outline-none focus:ring-4 focus:ring-fuchsia-100"
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
              className="w-full resize-none rounded-xl border-2 border-gray-300 bg-white px-4 py-4 text-base font-medium text-gray-900 shadow-sm placeholder:text-slate-400 focus:border-fuchsia-300 focus:outline-none focus:ring-4 focus:ring-fuchsia-100"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !title.trim() || !url.trim()}
            className={brandActionClass}
            style={brandActionStyle}
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
