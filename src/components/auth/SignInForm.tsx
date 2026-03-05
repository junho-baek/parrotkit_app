'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Input, Card } from '@/components/common';
import { SignInFormData } from '@/types/auth';
import { logClientEvent } from '@/lib/client-events';

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

      // 토큰과 사용자 정보 저장
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }
      if (data.expiresAt) {
        localStorage.setItem('tokenExpiresAt', String(data.expiresAt));
      }
      localStorage.setItem('user', JSON.stringify(data.user));

      await logClientEvent('login', { method: 'email' });

      // interests가 없으면 interests 페이지로, 있으면 홈으로
      if (!data.user.interests || data.user.interests.length === 0) {
        router.push('/interests');
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
    <Card className="w-full max-w-md card-luxury">
      <div className="text-center mb-8">
        <div className="mb-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg animate-pulse-glow">
            <span className="text-3xl">🦜</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">
          <span className="gradient-text">Sign In</span>
        </h1>
        <p className="text-gray-900 font-medium">Welcome back to ParrotKit!</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 text-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-900">
              Email or Username
            </label>
            <Input
              type="text"
              placeholder="Enter your email or username"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-900">
              Password
            </label>
            <Input
              type="password"
              placeholder="Enter your password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full btn-primary mt-6"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        <div className="mt-6 space-y-4">
          <div className="text-center">
            <Link href="#" className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm hover:underline transition-colors">
              Forgot your password?
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-900 font-bold">Don&apos;t have an account?</span>
            </div>
          </div>
          <Link href="/signup" className="block">
            <button className="w-full btn-secondary">
              Create Account
            </button>
          </Link>
        </div>
      </Card>
  );
};
