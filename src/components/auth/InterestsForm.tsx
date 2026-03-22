'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { authenticatedFetch, ensureValidAccessToken } from '@/lib/auth/client-session';
import { logClientEvent } from '@/lib/client-events';
import {
  INTEREST_CATEGORIES,
  type InterestCategory,
} from '@/types/auth';
import {
  isOnboardingProfileExtrasComplete,
  readOnboardingProfileExtras,
} from '@/lib/onboarding-profile';
import { InterestPicker } from './InterestPicker';

interface InterestTag {
  category: InterestCategory;
  selected: boolean;
}

function buildInterestTags(selectedInterests: string[] = []): InterestTag[] {
  const selectedSet = new Set(selectedInterests);
  return INTEREST_CATEGORIES.map((category) => ({
    category,
    selected: selectedSet.has(category),
  }));
}

export const InterestsForm: React.FC = () => {
  const router = useRouter();
  const [interests, setInterests] = React.useState<InterestTag[]>(buildInterestTags());
  const [loading, setLoading] = React.useState(false);
  const [initializing, setInitializing] = React.useState(true);
  const [selectionError, setSelectionError] = React.useState('');

  React.useEffect(() => {
    let cancelled = false;

    void (async () => {
      const token = await ensureValidAccessToken();
      if (!token) {
        router.replace('/signin');
        return;
      }

      try {
        const response = await authenticatedFetch('/api/user/profile');

        if (response.status === 401) {
          router.replace('/signin');
          return;
        }

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as {
          user?: {
            interests?: string[];
          };
        };

        const existingInterests = Array.isArray(data.user?.interests) ? data.user?.interests ?? [] : [];

        if (!cancelled) {
          setInterests(buildInterestTags(existingInterests));
        }

        const hasCompletedProfileStep = isOnboardingProfileExtrasComplete(readOnboardingProfileExtras());
        if (existingInterests.length === 0 && !hasCompletedProfileStep) {
          router.replace('/onboarding');
          return;
        }
      } catch (error) {
        console.error('Failed to prepare interests form:', error);
      } finally {
        if (!cancelled) {
          setInitializing(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  const toggleInterest = (index: number) => {
    setInterests((prev) => {
      const updated = [...prev];
      const willBeSelected = !updated[index].selected;

      updated[index] = {
        ...updated[index],
        selected: willBeSelected,
      };

      void logClientEvent(willBeSelected ? 'select_interest' : 'deselect_interest', {
        event_category: 'engagement',
        interest_name: updated[index].category,
      });

      return updated;
    });
    setSelectionError('');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const selectedInterests = interests
      .filter((interest) => interest.selected)
      .map((interest) => interest.category);

    if (selectedInterests.length === 0) {
      setSelectionError('Select at least one interest to continue.');
      return;
    }

    setLoading(true);

    try {
      const token = await ensureValidAccessToken();
      if (!token) {
        router.replace('/signin');
        return;
      }

      const response = await authenticatedFetch('/api/interests', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ interests: selectedInterests }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error || 'Failed to save interests.');
      }

      localStorage.setItem('onboardingCompleted', 'true');

      await logClientEvent('onboarding_complete', {
        event_category: 'engagement',
        interests_count: selectedInterests.length,
        interests: selectedInterests.join(','),
      });

      router.push('/paste');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save interests. Please try again.';
      setSelectionError(message);
    } finally {
      setLoading(false);
    }
  };

  if (initializing) {
    return (
      <div className="flex h-full items-center justify-center py-10 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 animate-pulse items-center justify-center rounded-full bg-white/80 shadow-md">
          <span className="text-xl">✨</span>
        </div>
        <p className="text-sm font-semibold text-gray-700">Preparing your interest feed...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex min-h-full flex-col">
      <div className="space-y-1.5">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500">
          Step 2 of 2
        </p>
        <h1 className="text-[1.45rem] font-bold tracking-[-0.04em] text-gray-900">
          Interests
        </h1>
      </div>

      <div className="flex-1 py-4">
        <div className="flex h-full items-center justify-center">
          <InterestPicker interests={interests} onToggle={toggleInterest} />
        </div>
      </div>

      {selectionError ? (
        <p className="brand-inline-error pb-2">{selectionError}</p>
      ) : null}

      <div className="sticky bottom-0 mt-4 bg-white pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-3">
        <button
          type="submit"
          disabled={loading}
          className="flex min-h-[54px] w-full items-center justify-center rounded-[1.35rem] px-5 text-sm font-bold tracking-[-0.02em] text-white transition-transform duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45"
          style={{
            backgroundImage: 'linear-gradient(135deg, #ff9568 0%, #de81c1 52%, #8c67ff 100%)',
            backgroundColor: '#de81c1',
            boxShadow: '0 16px 28px rgba(140, 103, 255, 0.18)',
          }}
        >
          {loading ? 'Saving...' : 'Finish'}
        </button>
      </div>
    </form>
  );
};
