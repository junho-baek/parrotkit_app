'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Card, LoadingScreen } from '@/components/common';
import { authenticatedFetch, ensureValidAccessToken } from '@/lib/auth/client-session';
import { logClientEvent } from '@/lib/client-events';
import { cn } from '@/lib/utils';
import { WordRotate } from '@/components/ui/word-rotate';

type URLInputFormVariant = 'page' | 'drawer';
type FormFieldName = 'title' | 'url';

interface URLInputFormProps {
  variant?: URLInputFormVariant;
}

type FormErrors = Partial<Record<FormFieldName, string>>;

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

const platformWords = ['TikTok', 'Instagram Reels', 'YouTube Shorts'];

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
  const [showOptionalDetails, setShowOptionalDetails] = useState(variant !== 'drawer');

  const titleRef = useRef<HTMLInputElement>(null);
  const urlRef = useRef<HTMLInputElement>(null);

  const isDrawer = variant === 'drawer';

  const titleId = useMemo(() => `url-form-title-${variant}`, [variant]);
  const urlId = useMemo(() => `url-form-url-${variant}`, [variant]);
  const nicheId = useMemo(() => `url-form-niche-${variant}`, [variant]);
  const goalId = useMemo(() => `url-form-goal-${variant}`, [variant]);
  const describeId = useMemo(() => `url-form-describe-${variant}`, [variant]);
  const optionalSectionId = useMemo(() => `url-form-optional-${variant}`, [variant]);

  const inputClassName = cn(
    'w-full rounded-2xl border border-slate-200/90 bg-white px-4 text-[15px] font-medium text-slate-900',
    'shadow-[0_1px_2px_rgb(15_23_42_/_0.04)] placeholder:text-slate-400',
    'transition-[border-color,box-shadow,background-color] duration-200 ease-out',
    'focus-visible:border-fuchsia-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-fuchsia-100/90',
    'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400',
    isDrawer ? 'py-3' : 'py-3.5'
  );

  const textareaClassName = cn(inputClassName, 'resize-none', isDrawer ? 'min-h-[84px]' : 'min-h-[104px]');

  const labelClassName = cn('block font-semibold text-slate-900', isDrawer ? 'text-[13px]' : 'text-sm');
  const fieldSpaceClassName = isDrawer ? 'space-y-1' : 'space-y-1.5';
  const formSpaceClassName = isDrawer ? 'space-y-3.5' : 'space-y-4';

  const brandActionClass = cn(
    'inline-flex w-full items-center justify-center gap-2 rounded-2xl text-[15px] font-semibold text-white',
    'shadow-[var(--shadow-brand-action-xl)] transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:brightness-105',
    'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-fuchsia-100/90',
    'disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0',
    isDrawer ? 'px-5 py-3' : 'px-5 py-3.5'
  );

  const brandActionStyle: React.CSSProperties = {
    backgroundImage: 'var(--gradient-brand-action)',
  };

  useEffect(() => {
    void (async () => {
      const token = await ensureValidAccessToken();
      if (!token) {
        router.push('/signin');
      }
    })();
  }, [router]);

  useEffect(() => {
    setShowOptionalDetails(variant !== 'drawer');
  }, [variant]);

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

  const optionalFields = (
    <>
      <div className={cn('grid gap-3', isDrawer ? 'grid-cols-2' : 'sm:grid-cols-2')}>
        <div className={fieldSpaceClassName}>
          <label htmlFor={nicheId} className={labelClassName}>
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

        <div className={fieldSpaceClassName}>
          <label htmlFor={goalId} className={labelClassName}>
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

      <div className={fieldSpaceClassName}>
        <label htmlFor={describeId} className={labelClassName}>
          Notes
        </label>
        <textarea
          id={describeId}
          name="notes"
          value={describe}
          onChange={(e) => setDescribe(e.target.value)}
          placeholder="Anything specific to preserve or improve…"
          rows={isDrawer ? 2 : 4}
          className={textareaClassName}
          disabled={loading}
          autoComplete="off"
        />
      </div>
    </>
  );

  const formInner = (
    <div className={cn('space-y-4', isDrawer ? 'pb-1' : 'space-y-5')}>
      <div className="px-1 pb-1 pt-1">
        <div className="space-y-3">
          <div className="space-y-1.5 text-center">
            <h2
              className={cn(
                'font-bold tracking-[-0.045em] text-slate-950',
                isDrawer
                  ? 'mx-auto w-full text-[1.54rem] leading-[1.02]'
                  : 'mx-auto max-w-[16ch] text-balance text-[2.32rem] leading-[0.96]'
              )}
            >
              {isDrawer ? (
                <>
                  <span className="block">
                    Paste a viral{' '}
                    <WordRotate
                      words={platformWords}
                      duration={2200}
                      reserveSpace={false}
                      className="inline-block bg-gradient-to-r from-sky-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent"
                    />{' '}
                    link,
                  </span>
                  <span className="block">
                    then turn it into your own content recipe
                    <span aria-hidden="true">🦜</span>.
                  </span>
                </>
              ) : (
                <>
                  Paste a viral{' '}
                  <WordRotate
                    words={platformWords}
                    duration={2200}
                    className="inline-block bg-gradient-to-r from-sky-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent"
                  />{' '}
                  link, then turn it into your own content recipe
                  <span aria-hidden="true">🦜</span>.
                </>
              )}
            </h2>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={formSpaceClassName} noValidate>
        <div className={fieldSpaceClassName}>
          <label htmlFor={titleId} className={labelClassName}>
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

        <div className={fieldSpaceClassName}>
          <label htmlFor={urlId} className={labelClassName}>
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

        {isDrawer ? (
          <div className="rounded-[1.4rem] border border-slate-200/85 bg-slate-50/75">
            <button
              type="button"
              aria-expanded={showOptionalDetails}
              aria-controls={optionalSectionId}
              onClick={() => setShowOptionalDetails((current) => !current)}
              className="flex w-full items-center justify-between gap-3 rounded-[1.4rem] px-4 py-3 text-left text-sm font-semibold text-slate-700 transition-colors duration-200 hover:bg-white/80 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-fuchsia-100/90"
            >
              <span>Optional Details</span>
              <ChevronDown
                className={cn('h-4 w-4 text-slate-500 transition-transform duration-200', showOptionalDetails ? 'rotate-180' : '')}
                aria-hidden="true"
              />
            </button>

            {showOptionalDetails ? (
              <div id={optionalSectionId} className="space-y-3 px-4 pb-4 pt-1">
                {optionalFields}
              </div>
            ) : null}
          </div>
        ) : (
          optionalFields
        )}

        <button type="submit" disabled={loading} className={brandActionClass} style={brandActionStyle}>
          <span>{loading ? 'Analyzing Video…' : 'Analyze Video'}</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </form>

      {!isDrawer ? (
        <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3 text-sm text-slate-600 shadow-[0_14px_28px_rgb(15_23_42_/_0.04)]">
          You will get scene-by-scene motion descriptions and a reusable recipe structure from the source video.
        </div>
      ) : null}
    </div>
  );

  if (isDrawer) {
    return formInner;
  }

  return (
    <Card className="relative w-full overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-4 shadow-[0_24px_60px_rgb(15_23_42_/_0.06)] sm:p-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[-0.75rem] top-0 h-48 bg-[radial-gradient(74%_62%_at_50%_0%,rgba(213,232,255,0.74)_0%,rgba(238,228,255,0.46)_40%,rgba(255,255,255,0)_80%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-slate-200/75 to-transparent"
      />
      <div className="relative z-10">{formInner}</div>
    </Card>
  );
};
