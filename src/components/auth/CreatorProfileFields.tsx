'use client';

import React from 'react';
import {
  CREATOR_ACTIVITY_PURPOSE_OPTIONS,
  CREATOR_AGE_GROUP_OPTIONS,
  CREATOR_DOMAIN_SUGGESTIONS,
  CREATOR_FOLLOWER_RANGE_OPTIONS,
  CREATOR_GENDER_OPTIONS,
  type OnboardingProfileExtras,
} from '@/types/auth';

interface CreatorProfileFieldsProps {
  profile: OnboardingProfileExtras;
  onChange: (field: keyof OnboardingProfileExtras, value: string) => void;
  domainSuggestionsId?: string;
}

const fieldBaseClassName =
  'brand-form-field w-full rounded-[1.35rem] px-4 py-3.5 text-sm font-medium text-gray-900 placeholder:text-gray-500';

export const CreatorProfileFields: React.FC<CreatorProfileFieldsProps> = ({
  profile,
  onChange,
  domainSuggestionsId = 'creator-profile-domain-suggestions',
}) => {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-bold tracking-[-0.02em] text-gray-900">Age Group</span>
          <select
            value={profile.ageGroup}
            onChange={(event) => onChange('ageGroup', event.target.value)}
            className={fieldBaseClassName}
          >
            <option value="">Select age group</option>
            {CREATOR_AGE_GROUP_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold tracking-[-0.02em] text-gray-900">Gender</span>
          <select
            value={profile.gender}
            onChange={(event) => onChange('gender', event.target.value)}
            className={fieldBaseClassName}
          >
            <option value="">Select gender</option>
            {CREATOR_GENDER_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-bold tracking-[-0.02em] text-gray-900">Domain</span>
        <input
          type="text"
          value={profile.domain}
          onChange={(event) => onChange('domain', event.target.value)}
          list={domainSuggestionsId}
          placeholder="e.g. Beauty, Finance, Food, Education"
          className={fieldBaseClassName}
        />
        <datalist id={domainSuggestionsId}>
          {CREATOR_DOMAIN_SUGGESTIONS.map((domain) => (
            <option key={domain} value={domain} />
          ))}
        </datalist>
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-bold tracking-[-0.02em] text-gray-900">Followers</span>
        <select
          value={profile.followerRange}
          onChange={(event) => onChange('followerRange', event.target.value)}
          className={fieldBaseClassName}
        >
          <option value="">Select follower range</option>
          {CREATOR_FOLLOWER_RANGE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <div>
        <span className="mb-2 block text-sm font-bold tracking-[-0.02em] text-gray-900">Activity Purpose</span>
        <div className="flex flex-wrap gap-2.5">
          {CREATOR_ACTIVITY_PURPOSE_OPTIONS.map((purpose) => {
            const isSelected = profile.activityPurpose === purpose;
            return (
              <button
                key={purpose}
                type="button"
                data-selected={isSelected ? 'true' : 'false'}
                onClick={() => onChange('activityPurpose', purpose)}
                className="brand-pill min-h-[50px] rounded-full px-4 py-2 text-sm font-bold tracking-[-0.02em]"
              >
                {purpose}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
