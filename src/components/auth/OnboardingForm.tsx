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
    <form onSubmit={handleSubmit} className="flex min-h-full flex-col">
      <div className="space-y-1.5">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500">
          Step 1 of 2
        </p>
        <h1 className="text-[1.45rem] font-bold tracking-[-0.04em] text-gray-900">
          Creator profile
        </h1>
      </div>

      <div className="flex-1 py-4">
        <div className="flex h-full flex-col justify-center gap-4">
          <CreatorProfileFields
            profile={profile}
            onChange={handleChange}
            domainSuggestionsId="onboarding-domain-suggestions"
          />

          {error ? (
            <p className="brand-inline-error">{error}</p>
          ) : null}
        </div>
      </div>

      <div className="sticky bottom-0 mt-4 bg-white pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-3">
        <button
          type="submit"
          className="flex min-h-[54px] w-full items-center justify-center rounded-[1.35rem] px-5 text-sm font-bold tracking-[-0.02em] text-white transition-transform duration-200 hover:-translate-y-0.5"
          style={{
            backgroundImage: 'linear-gradient(135deg, #ff9568 0%, #de81c1 52%, #8c67ff 100%)',
            backgroundColor: '#de81c1',
            boxShadow: '0 16px 28px rgba(140, 103, 255, 0.18)',
          }}
        >
          Continue
        </button>
      </div>
    </form>
  );
};
