'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ensureValidAccessToken } from '@/lib/auth/client-session';
import {
  isOnboardingProfileExtrasComplete,
  readOnboardingProfileExtras,
  saveOnboardingProfileExtras,
} from '@/lib/onboarding-profile';
import { ONBOARDING_PROFILE_DEFAULTS, type OnboardingProfileExtras } from '@/types/auth';
import { CreatorProfileFields } from './CreatorProfileFields';

export const OnboardingForm: React.FC = () => {
  const router = useRouter();
  const [profile, setProfile] = React.useState<OnboardingProfileExtras>({
    ...ONBOARDING_PROFILE_DEFAULTS,
  });
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    void (async () => {
      const token = await ensureValidAccessToken();
      if (!token) {
        router.replace('/signin');
        return;
      }

      setProfile(readOnboardingProfileExtras());
    })();
  }, [router]);

  const handleChange = (field: keyof OnboardingProfileExtras, value: string) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError('');
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isOnboardingProfileExtrasComplete(profile)) {
      setError('Please complete age group, gender, domain, follower range, and activity purpose.');
      return;
    }

    saveOnboardingProfileExtras(profile);
    router.push('/interests');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div
        className="rounded-[2rem] border p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)] sm:p-6"
        style={{
          borderColor: 'var(--brand-soft-border)',
          background: 'var(--brand-soft-surface)',
        }}
      >
        <div className="mb-5">
          <span className="inline-flex rounded-full border border-white/80 bg-white/70 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-gray-600">
            Step 1 of 2
          </span>
          <h1 className="mt-3 text-[2rem] font-bold tracking-[-0.04em] text-gray-900">
            Build your creator profile
          </h1>
          <p className="mt-2 text-sm font-medium leading-6 text-gray-700">
            Tell us who you create for so we can shape a sharper reference feed in the next step.
          </p>
        </div>

        <CreatorProfileFields
          profile={profile}
          onChange={handleChange}
          domainSuggestionsId="onboarding-domain-suggestions"
        />

        {error ? (
          <p className="brand-inline-error mt-4">{error}</p>
        ) : null}
      </div>

      <button
        type="submit"
        className="brand-primary-button flex min-h-[56px] w-full items-center justify-center rounded-[1.4rem] px-5 text-base font-bold tracking-[-0.02em]"
      >
        Continue to interests
      </button>
    </form>
  );
};
