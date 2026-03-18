import { ONBOARDING_PROFILE_DEFAULTS, OnboardingProfileExtras } from '@/types/auth';

const ONBOARDING_PROFILE_STORAGE_KEY = 'onboardingProfileExtras';

function sanitizeValue(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export function readOnboardingProfileExtras(): OnboardingProfileExtras {
  if (typeof window === 'undefined') {
    return { ...ONBOARDING_PROFILE_DEFAULTS };
  }

  try {
    const raw = localStorage.getItem(ONBOARDING_PROFILE_STORAGE_KEY);
    if (!raw) {
      return { ...ONBOARDING_PROFILE_DEFAULTS };
    }

    const parsed = JSON.parse(raw) as Partial<OnboardingProfileExtras>;
    return {
      ageGroup: sanitizeValue(parsed.ageGroup),
      gender: sanitizeValue(parsed.gender),
      domain: sanitizeValue(parsed.domain),
      followerRange: sanitizeValue(parsed.followerRange),
      activityPurpose: sanitizeValue(parsed.activityPurpose),
    };
  } catch {
    return { ...ONBOARDING_PROFILE_DEFAULTS };
  }
}

export function saveOnboardingProfileExtras(profile: OnboardingProfileExtras): void {
  if (typeof window === 'undefined') {
    return;
  }

  const normalized: OnboardingProfileExtras = {
    ageGroup: sanitizeValue(profile.ageGroup),
    gender: sanitizeValue(profile.gender),
    domain: sanitizeValue(profile.domain),
    followerRange: sanitizeValue(profile.followerRange),
    activityPurpose: sanitizeValue(profile.activityPurpose),
  };

  localStorage.setItem(ONBOARDING_PROFILE_STORAGE_KEY, JSON.stringify(normalized));
}

export function isOnboardingProfileExtrasComplete(profile: OnboardingProfileExtras): boolean {
  return Boolean(
    sanitizeValue(profile.ageGroup) &&
      sanitizeValue(profile.gender) &&
      sanitizeValue(profile.domain) &&
      sanitizeValue(profile.followerRange) &&
      sanitizeValue(profile.activityPurpose)
  );
}
