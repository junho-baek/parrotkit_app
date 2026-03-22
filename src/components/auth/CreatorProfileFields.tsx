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
  'brand-form-field w-full rounded-[1.1rem] px-3.5 py-3 text-sm font-medium text-gray-900 placeholder:text-gray-500';

export const CreatorProfileFields: React.FC<CreatorProfileFieldsProps> = ({
  profile,
  onChange,
  domainSuggestionsId = 'creator-profile-domain-suggestions',
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-bold tracking-[-0.02em] text-gray-900">Age Group</span>
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
          <span className="mb-1.5 block text-[13px] font-bold tracking-[-0.02em] text-gray-900">Gender</span>
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
        <span className="mb-1.5 block text-[13px] font-bold tracking-[-0.02em] text-gray-900">Domain</span>
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
        <span className="mb-1.5 block text-[13px] font-bold tracking-[-0.02em] text-gray-900">Followers</span>
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
        <span className="mb-1.5 block text-[13px] font-bold tracking-[-0.02em] text-gray-900">Activity Purpose</span>
        <div className="grid grid-cols-3 gap-1.5">
          {CREATOR_ACTIVITY_PURPOSE_OPTIONS.map((purpose) => {
            const isSelected = profile.activityPurpose === purpose;
            return (
              <button
                key={purpose}
                type="button"
                data-selected={isSelected ? 'true' : 'false'}
                onClick={() => onChange('activityPurpose', purpose)}
                className="brand-pill min-h-[42px] rounded-[0.95rem] px-2 py-1.5 text-[11px] font-bold leading-[1.15] tracking-[-0.025em]"
                style={
                  isSelected
                    ? {
                        backgroundImage: 'linear-gradient(135deg, #ff9568 0%, #de81c1 52%, #8c67ff 100%)',
                        backgroundColor: '#de81c1',
                        color: '#ffffff',
                        borderColor: 'transparent',
                        boxShadow: '0 12px 22px rgba(140, 103, 255, 0.2)',
                      }
                    : undefined
                }
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
