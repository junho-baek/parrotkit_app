'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 기존 dashboard는 /home으로 리다이렉트
export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/home');
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mb-4 inline-block">
          <img src="/parrot-logo.png" alt="Loading" className="w-16 h-16 animate-bounce-logo" />
        </div>
        <p className="text-gray-600 font-semibold">Redirecting...</p>
      </div>
    </div>
  );
}
