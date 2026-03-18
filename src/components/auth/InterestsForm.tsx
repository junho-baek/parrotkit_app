'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card } from '@/components/common';
import { authenticatedFetch, ensureValidAccessToken } from '@/lib/auth/client-session';
import {
  CREATOR_ACTIVITY_PURPOSE_OPTIONS,
  CREATOR_AGE_GROUP_OPTIONS,
  CREATOR_DOMAIN_SUGGESTIONS,
  CREATOR_FOLLOWER_RANGE_OPTIONS,
  CREATOR_GENDER_OPTIONS,
  InterestCategory,
  INTEREST_CATEGORIES,
  ONBOARDING_PROFILE_DEFAULTS,
  OnboardingProfileExtras,
} from '@/types/auth';
import { logClientEvent } from '@/lib/client-events';
import {
  isOnboardingProfileExtrasComplete,
  readOnboardingProfileExtras,
  saveOnboardingProfileExtras,
} from '@/lib/onboarding-profile';

interface InterestTag {
  category: InterestCategory;
  selected: boolean;
}

export const InterestsForm: React.FC = () => {
  const router = useRouter();
  const [interests, setInterests] = useState<InterestTag[]>(
    INTEREST_CATEGORIES.map(category => ({
      category,
      selected: false,
    }))
  );
  const [profileExtras, setProfileExtras] = useState<OnboardingProfileExtras>({
    ...ONBOARDING_PROFILE_DEFAULTS,
  });

  const [loading, setLoading] = useState(false);
  const [profileError, setProfileError] = useState('');

  // 로그인 체크
  useEffect(() => {
    void (async () => {
      const token = await ensureValidAccessToken();
      if (!token) {
        alert('로그인이 필요합니다.');
        router.push('/signin');
      }
    })();
  }, [router]);

  useEffect(() => {
    setProfileExtras(readOnboardingProfileExtras());
  }, []);

  const toggleInterest = (index: number) => {
    const updated = [...interests];
    const willBeSelected = !updated[index].selected;
    updated[index] = {
      ...updated[index],
      selected: willBeSelected
    };
    
    void logClientEvent(willBeSelected ? 'select_interest' : 'deselect_interest', {
      event_category: 'engagement',
      interest_name: updated[index].category,
    });

    setInterests(updated);
  };

  const handleProfileInputChange = (
    field: keyof OnboardingProfileExtras,
    value: string
  ) => {
    setProfileExtras((prev) => ({
      ...prev,
      [field]: value,
    }));
    setProfileError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const selectedInterests = interests
      .filter(interest => interest.selected)
      .map(interest => interest.category);

    if (selectedInterests.length === 0) {
      alert('최소 하나 이상의 관심사를 선택해주세요');
      setLoading(false);
      return;
    }

    if (!isOnboardingProfileExtrasComplete(profileExtras)) {
      setProfileError('나이대, 성별, 도메인, 팔로워 규모, 활동 목적을 모두 입력해주세요.');
      setLoading(false);
      return;
    }

    try {
      const token = await ensureValidAccessToken();
      
      if (!token) {
        alert('로그인이 필요합니다.');
        router.push('/signin');
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
        const data = await response.json();
        throw new Error(data.error || '관심사 저장에 실패했습니다.');
      }

      // 성공 - 다음 페이지로 이동
      alert('관심사가 저장되었습니다!');
      saveOnboardingProfileExtras(profileExtras);
      
      // 온보딩 완료 플래그 설정 (프로모션 모달 표시용)
      localStorage.setItem('onboardingCompleted', 'true');
      
      await logClientEvent('onboarding_complete', {
        event_category: 'engagement',
        interests_count: selectedInterests.length,
        interests: selectedInterests.join(','),
      });
      
      router.push('/paste');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : '관심사 저장에 실패했습니다. 다시 시도해주세요.';
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const selectedCount = interests.filter(i => i.selected).length;

  return (
    <Card className="w-full max-w-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your interests</h1>
        <p className="text-gray-900 text-base font-medium">
          Select a few genres to help us tailor reference recommendations
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="rounded-2xl border-2 border-purple-100 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 mb-7">
          <h3 className="text-lg font-bold text-gray-900 mb-1.5">Creator profile</h3>
          <p className="text-sm text-gray-700 mb-4">
            We use this to fine-tune recommendations for your style and growth goal.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-sm font-bold text-gray-900 mb-1.5">Age Group</span>
              <select
                value={profileExtras.ageGroup}
                onChange={(event) => handleProfileInputChange('ageGroup', event.target.value)}
                className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
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
              <span className="block text-sm font-bold text-gray-900 mb-1.5">Gender</span>
              <select
                value={profileExtras.gender}
                onChange={(event) => handleProfileInputChange('gender', event.target.value)}
                className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
              >
                <option value="">Select gender</option>
                {CREATOR_GENDER_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="md:col-span-2 block">
              <span className="block text-sm font-bold text-gray-900 mb-1.5">Domain</span>
              <input
                type="text"
                value={profileExtras.domain}
                onChange={(event) => handleProfileInputChange('domain', event.target.value)}
                list="creator-domain-suggestions"
                placeholder="e.g. Beauty, Finance, Food, Education"
                className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
                required
              />
              <datalist id="creator-domain-suggestions">
                {CREATOR_DOMAIN_SUGGESTIONS.map((domain) => (
                  <option key={domain} value={domain} />
                ))}
              </datalist>
            </label>

            <label className="block">
              <span className="block text-sm font-bold text-gray-900 mb-1.5">Followers</span>
              <select
                value={profileExtras.followerRange}
                onChange={(event) => handleProfileInputChange('followerRange', event.target.value)}
                className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
              >
                <option value="">Select range</option>
                {CREATOR_FOLLOWER_RANGE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4">
            <span className="block text-sm font-bold text-gray-900 mb-2">Activity Purpose</span>
            <div className="flex flex-wrap gap-2">
              {CREATOR_ACTIVITY_PURPOSE_OPTIONS.map((purpose) => {
                const isSelected = profileExtras.activityPurpose === purpose;
                return (
                  <button
                    key={purpose}
                    type="button"
                    onClick={() => handleProfileInputChange('activityPurpose', purpose)}
                    className={`px-3.5 py-2 rounded-full text-xs font-bold border-2 transition-all ${
                      isSelected
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-white text-gray-800 border-gray-300 hover:border-gray-500'
                    }`}
                  >
                    {purpose}
                  </button>
                );
              })}
            </div>
          </div>

          {profileError ? (
            <p className="mt-3 text-sm font-semibold text-red-600">{profileError}</p>
          ) : null}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
          {interests.map((interest, index) => (
            <button
              key={interest.category}
              type="button"
              onClick={() => toggleInterest(index)}
              style={{
                backgroundColor: interest.selected ? '#3B82F6' : '#FFFFFF',
                color: interest.selected ? '#FFFFFF' : '#111827',
                borderColor: interest.selected ? '#3B82F6' : '#D1D5DB',
              }}
              className={`py-3 px-5 rounded-full font-bold text-base transition-all duration-200 border-2 active:scale-95`}
            >
              {interest.category}
            </button>
          ))}
        </div>

        <div className="text-base text-gray-900 mb-6 text-center font-semibold">
          {selectedCount} 개 선택됨
        </div>

        <Button type="submit" disabled={loading || selectedCount === 0}>
          {loading ? 'Saving...' : 'Submit'}
        </Button>
      </form>
    </Card>
  );
};
