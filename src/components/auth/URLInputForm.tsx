'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Card, LoadingScreen } from '@/components/common';
import { authenticatedFetch, ensureValidAccessToken } from '@/lib/auth/client-session';
import { logClientEvent } from '@/lib/client-events';
import { cn } from '@/lib/utils';

type URLInputFormVariant = 'page' | 'drawer';
type FormFieldName = 'title' | 'url';

interface URLInputFormProps {
  variant?: URLInputFormVariant;
}

type FormErrors = Partial<Record<FormFieldName, string>>;

const inputClassName =
  'w-full rounded-2xl border border-slate-200/90 bg-white px-4 py-3.5 text-[15px] font-medium text-slate-900 shadow-[0_1px_2px_rgb(15_23_42_/_0.04)] placeholder:text-slate-400 focus-visible:border-fuchsia-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-fuchsia-100/90 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400';

const textareaClassName = `${inputClassName} min-h-[104px] resize-none py-3.5`;

const fieldMeta: Record<FormFieldName, { label: string; placeholder: string; type: string }> = {
  title: {
    label: 'Recipe Title *',
    placeholder: 'e.g., Korean Diet Viral Hook…',
    type: 'text',
  },
  url: {
    label: 'Video URL *',
    placeholder: 'https://www.tiktok.com/@username/video/…',
    type: 'url',
  },
};

function isLikelyUrl(value: string) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

export const URLInputForm: React.FC<URLInputFormProps> = ({ variant = 'page' }) => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [niche, setNiche] = useState('');
  const [goal, setGoal] = useState('');
  const [describe, setDescribe] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const titleRef = useRef<HTMLInputElement>(null);
  const urlRef = useRef<HTMLInputElement>(null);

  const isDrawer = variant === 'drawer';

  const brandActionClass = cn(
    'inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-[15px] font-semibold text-white shadow-[var(--shadow-brand-action-xl)]',
    'transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:brightness-105',
    'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-fuchsia-100/90',
    'disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0'
  );
  const brandActionStyle: React.CSSProperties = {
    backgroundImage: 'var(--gradient-brand-action)',
  };

  const titleId = useMemo(() => `url-form-title-${variant}`, [variant]);
  const urlId = useMemo(() => `url-form-url-${variant}`, [variant]);
  const nicheId = useMemo(() => `url-form-niche-${variant}`, [variant]);
  const goalId = useMemo(() => `url-form-goal-${variant}`, [variant]);
  const describeId = useMemo(() => `url-form-describe-${variant}`, [variant]);

  useEffect(() => {
    void (async () => {
      const token = await ensureValidAccessToken();
      if (!token) {
        router.push('/signin');
      }
    })();
  }, [router]);

  const focusField = (field: FormFieldName) => {
    if (field === 'title') {
      titleRef.current?.focus();
      return;
    }

    urlRef.current?.focus();
  };

  const setFieldError = (field: FormFieldName, value: string) => {
    setErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });

    if (field === 'title') {
      setTitle(value);
      return;
    }

    setUrl(value);
  };

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!title.trim()) {
      nextErrors.title = '레시피 제목을 입력해 주세요.';
    }

    if (!url.trim()) {
      nextErrors.url = '영상 URL을 입력해 주세요.';
    } else if (!isLikelyUrl(url.trim())) {
      nextErrors.url = '올바른 URL 형식으로 입력해 주세요.';
    }

    setErrors(nextErrors);

    const firstInvalidField = (Object.keys(nextErrors)[0] || null) as FormFieldName | null;
    if (firstInvalidField) {
      focusField(firstInvalidField);
    }

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
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

      sessionStorage.setItem(
        'recipeData',
        JSON.stringify({
          scenes: data.scenes,
          videoUrl: url,
          capturedVideos: {},
          matchResults: {},
          recipeId,
          metadata: data.metadata || {},
          transcript: data.transcript || [],
        })
      );

      router.push(recipeId ? `/home?view=recipe&recipeId=${recipeId}` : '/home?view=recipe');
    } catch (error) {
      console.error('URL submit error:', error);
      setErrors({
        url: '비디오 분석에 실패했습니다. 링크를 확인하고 다시 시도해 주세요.',
      });
      focusField('url');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen message="Creating video recipe…" />;
  }

  const formInner = (
    <div className={cn('space-y-5', isDrawer ? 'px-1 pb-1' : '')}>
      <div className={cn('space-y-2', isDrawer ? 'text-left' : 'text-center')}>
        <div
          className={cn(
            'inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-3 py-1 text-[12px] font-semibold text-slate-700 shadow-[0_8px_24px_rgb(15_23_42_/_0.06)]',
            isDrawer ? 'mx-0' : 'mx-auto'
          )}
        >
          <Sparkles className="h-3.5 w-3.5 text-fuchsia-500" aria-hidden="true" />
          Add Reference
        </div>
        <div className="space-y-1.5">
          <h2 className="text-balance text-[28px] font-bold leading-tight text-slate-950">
            Paste A Viral Video Link
          </h2>
          <p className="text-[14px] leading-6 text-slate-600">
            Paste a TikTok, Instagram, or YouTube Shorts link, then turn it into a motion-aware recipe flow.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <label htmlFor={titleId} className="block text-sm font-semibold text-slate-900">
            {fieldMeta.title.label}
          </label>
          <input
            ref={titleRef}
            id={titleId}
            name="recipeTitle"
            type={fieldMeta.title.type}
            value={title}
            onChange={(e) => setFieldError('title', e.target.value)}
            placeholder={fieldMeta.title.placeholder}
            className={inputClassName}
            disabled={loading}
            required
            maxLength={80}
            autoComplete="off"
            aria-invalid={errors.title ? 'true' : 'false'}
            aria-describedby={errors.title ? `${titleId}-error` : undefined}
          />
          <p id={`${titleId}-error`} aria-live="polite" className="min-h-5 text-sm text-rose-600">
            {errors.title || ''}
          </p>
        </div>

        <div className="space-y-1.5">
          <label htmlFor={urlId} className="block text-sm font-semibold text-slate-900">
            {fieldMeta.url.label}
          </label>
          <input
            ref={urlRef}
            id={urlId}
            name="videoUrl"
            type={fieldMeta.url.type}
            value={url}
            onChange={(e) => setFieldError('url', e.target.value)}
            placeholder={fieldMeta.url.placeholder}
            className={inputClassName}
            disabled={loading}
            required
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            inputMode="url"
            aria-invalid={errors.url ? 'true' : 'false'}
            aria-describedby={errors.url ? `${urlId}-error` : undefined}
          />
          <p id={`${urlId}-error`} aria-live="polite" className="min-h-5 text-sm text-rose-600">
            {errors.url || ''}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor={nicheId} className="block text-sm font-semibold text-slate-900">
              Niche
            </label>
            <input
              id={nicheId}
              name="niche"
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="e.g., Cooking, Fitness…"
              className={inputClassName}
              disabled={loading}
              autoComplete="off"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor={goalId} className="block text-sm font-semibold text-slate-900">
              Goal
            </label>
            <input
              id={goalId}
              name="goal"
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g., Better hook pacing…"
              className={inputClassName}
              disabled={loading}
              autoComplete="off"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor={describeId} className="block text-sm font-semibold text-slate-900">
            Notes
          </label>
          <textarea
            id={describeId}
            name="notes"
            value={describe}
            onChange={(e) => setDescribe(e.target.value)}
            placeholder="Anything specific to preserve or improve…"
            rows={4}
            className={textareaClassName}
            disabled={loading}
            autoComplete="off"
          />
        </div>

        <button type="submit" disabled={loading} className={brandActionClass} style={brandActionStyle}>
          <span>{loading ? 'Analyzing Video…' : 'Analyze Video'}</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </form>

      <div className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm text-slate-600 shadow-[0_14px_28px_rgb(15_23_42_/_0.05)]">
        You will get scene-by-scene motion descriptions and a reusable recipe structure from the source video.
      </div>
    </div>
  );

  if (isDrawer) {
    return formInner;
  }

  return (
    <Card
      className="w-full rounded-[2rem] border border-[color:var(--brand-soft-border)] bg-[image:var(--brand-soft-surface)] p-6 shadow-[0_24px_60px_rgb(15_23_42_/_0.08)] sm:p-8"
    >
      {formInner}
    </Card>
  );
};
