'use client';

import Link from 'next/link';
import { Button, Card } from '@/components/common';
import { logClientEvent } from '@/lib/client-events';

export default function Home() {
  const handleSignInClick = () => {
    void logClientEvent('click_signin_home', {
      event_category: 'engagement',
      event_label: 'home_page_signin',
    });
  };

  const handleSignUpClick = () => {
    void logClientEvent('click_signup_home', {
      event_category: 'engagement',
      event_label: 'home_page_signup',
    });
  };

  return (
    <div className="flex flex-1 items-center justify-center overflow-y-auto p-4">
      <Card className="text-center">
        <div className="mb-12">
          <div className="inline-block mb-4">
            <img src="/parrot-logo.png" alt="ParrotKit" className="w-24 h-24" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">ParrotKit</h1>
          <p className="text-gray-600 text-sm">Viral Recipe for UCC Creators</p>
        </div>

        <div className="space-y-3">
          <Link href="/signin" onClick={handleSignInClick} className="block">
            <Button variant="primary">Sign In</Button>
          </Link>
          <Link href="/signup" onClick={handleSignUpClick} className="block">
            <Button variant="secondary">Sign Up</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
