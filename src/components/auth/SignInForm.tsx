'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/common';
import { SignInFormData } from '@/types/auth';
import { logClientEvent } from '@/lib/client-events';
import { persistClientSession } from '@/lib/auth/client-session';

export const SignInForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<SignInFormData>({
    email: '',
    password: '',
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
    if (!formData.email || !formData.password) {
      setError('이메일과 비밀번호를 입력해주세요');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.email, // email 필드에 username/email 모두 가능
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '로그인에 실패했습니다.');
      }

      persistClientSession({
        token: data.token,
        refreshToken: data.refreshToken,
        expiresAt: data.expiresAt,
        user: data.user,
      });

      await logClientEvent('login', { method: 'email' });

      // interests가 없으면 onboarding 페이지로, 있으면 홈으로
      if (!data.user.interests || data.user.interests.length === 0) {
        router.push('/onboarding');
      } else {
        router.push('/home');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '로그인에 실패했습니다. 다시 시도해주세요.';
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

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5 text-left">
          <label className="text-sm font-semibold tracking-[-0.01em] text-slate-900">
            Email or Username
          </label>
          <Input
            type="text"
            placeholder="Enter your email or username"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="brand-form-field py-3"
            required
          />
        </div>

        <div className="flex flex-col gap-1.5 text-left">
          <label className="text-sm font-semibold tracking-[-0.01em] text-slate-900">
            Password
          </label>
          <Input
            type="password"
            placeholder="Enter your password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="brand-form-field py-3"
            required
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="brand-primary-button mt-2 rounded-[1.35rem] py-3.5 text-lg font-semibold"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="size-5 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Signing in...
            </span>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>

      <div className="mt-3 flex flex-col gap-3">
        <Link href="/signup" className="rounded-[1.35rem] border border-slate-200 bg-transparent py-3.5 text-center text-lg font-semibold text-slate-800 transition-colors duration-200 hover:bg-white/70">
          Create Account
        </Link>
      </div>
    </div>
  );
};
