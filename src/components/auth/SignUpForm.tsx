'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/common';
import { SignUpFormData } from '@/types/auth';
import { logClientEvent } from '@/lib/client-events';
import { persistClientSession } from '@/lib/auth/client-session';

export const SignUpForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<SignUpFormData>({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // 기본 유효성 검사
    if (!formData.email || !formData.username || !formData.password || !formData.confirmPassword) {
      await logClientEvent('signup_failed', {
        event_category: 'engagement',
        event_label: 'signup_validation_failed',
        reason: 'missing_required_field',
      });
      setError('모든 필드를 입력해주세요');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      await logClientEvent('signup_failed', {
        event_category: 'engagement',
        event_label: 'signup_validation_failed',
        reason: 'password_mismatch',
      });
      setError('비밀번호가 일치하지 않습니다');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      await logClientEvent('signup_failed', {
        event_category: 'engagement',
        event_label: 'signup_validation_failed',
        reason: 'password_too_short',
      });
      setError('비밀번호는 최소 6자 이상이어야 합니다');
      setLoading(false);
      return;
    }

    await logClientEvent('signup_start', {
      event_category: 'engagement',
      event_label: 'signup_valid_submit',
    });

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '회원가입에 실패했습니다.');
      }

      persistClientSession({
        token: data.token,
        refreshToken: data.refreshToken,
        expiresAt: data.expiresAt,
        user: data.user,
      });
      
      await logClientEvent('signup_success', { method: 'email' });
      
      // Onboarding 페이지로 이동
      router.push('/onboarding');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '회원가입에 실패했습니다. 다시 시도해주세요.';
      await logClientEvent('signup_failed', {
        event_category: 'engagement',
        event_label: 'signup_request_failed',
        reason: message,
      });
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {error && (
        <div className="mb-5 rounded-[1.25rem] border border-red-200 bg-red-50/95 px-4 py-3 text-left text-sm font-semibold text-red-700 animate-fade-in">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 text-left">
          <label className="text-sm font-semibold tracking-[-0.01em] text-slate-900">
            Email Address
          </label>
          <Input
            type="email"
            placeholder="Enter your email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="brand-form-field"
            required
          />
        </div>

        <div className="flex flex-col gap-2 text-left">
          <label className="text-sm font-semibold tracking-[-0.01em] text-slate-900">
            Username
          </label>
          <Input
            type="text"
            placeholder="Choose a username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="brand-form-field"
            required
          />
        </div>

        <div className="flex flex-col gap-2 text-left">
          <label className="text-sm font-semibold tracking-[-0.01em] text-slate-900">
            Password
          </label>
          <Input
            type="password"
            placeholder="Create a password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="brand-form-field"
            required
          />
        </div>

        <div className="flex flex-col gap-2 text-left">
          <label className="text-sm font-semibold tracking-[-0.01em] text-slate-900">
            Confirm Password
          </label>
          <Input
            type="password"
            placeholder="Re-type your password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="brand-form-field"
            required
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="brand-primary-button mt-3 rounded-[1.35rem] py-4 text-lg font-semibold"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="size-5 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Creating account...
            </span>
          ) : (
            'Create Account'
          )}
        </Button>
      </form>

      <div className="mt-4 flex flex-col gap-3">
        <Link href="/signin" className="rounded-[1.35rem] border border-slate-200 bg-transparent py-4 text-center text-lg font-semibold text-slate-800 transition-colors duration-200 hover:bg-white/70">
          Sign In
        </Link>
      </div>
    </div>
  );
};
