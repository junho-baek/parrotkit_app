'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/common';
import { FlickeringGrid } from '@/components/ui/flickering-grid';
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
    <div className="relative flex flex-1 overflow-y-auto bg-[linear-gradient(180deg,#fffaf7_0%,#fdf7ff_48%,#f6f9ff_100%)]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-6rem] h-56 w-56 -translate-x-1/2 rounded-full bg-[rgb(255_149_104/0.28)] blur-3xl" />
        <div className="absolute right-[-4rem] top-1/3 h-52 w-52 rounded-full bg-[rgb(140_103_255/0.16)] blur-3xl" />
        <div className="absolute bottom-8 left-[-3rem] h-48 w-48 rounded-full bg-[rgb(222_129_193/0.16)] blur-3xl" />
        <FlickeringGrid
          className="absolute inset-0 opacity-80 [mask-image:radial-gradient(circle_at_center,black_0%,black_58%,transparent_92%)]"
          squareSize={6}
          gridGap={10}
          color="rgb(140, 103, 255)"
          maxOpacity={0.16}
          flickerChance={0.14}
        />
        <FlickeringGrid
          className="absolute inset-0 opacity-60 [mask-image:radial-gradient(circle_at_50%_24%,black_0%,transparent_70%)]"
          squareSize={6}
          gridGap={12}
          color="rgb(255, 149, 104)"
          maxOpacity={0.12}
          flickerChance={0.1}
        />
      </div>

      <div className="relative flex min-h-full w-full flex-col justify-between px-6 pb-[calc(env(safe-area-inset-bottom)+2rem)] pt-[calc(env(safe-area-inset-top)+1.5rem)]">
        <section className="flex flex-1 flex-col items-center justify-center">
          <div className="flex w-full max-w-sm flex-col items-center gap-5 text-center">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 scale-[1.35] rounded-full bg-[radial-gradient(circle,_rgb(255_149_104/0.34)_0%,_rgb(140_103_255/0.16)_48%,_transparent_74%)] blur-2xl" />
              <div className="relative rounded-[2rem]">
                <Image src="/parrot-logo.png" alt="ParrotKit" width={120} height={120} className="size-30" priority />
              </div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <h1 className="text-5xl font-black tracking-[-0.04em] text-slate-950">ParrotKit</h1>
              <p className="text-base font-medium leading-6 text-slate-600">
                Viral Recipe for UGC Creators
              </p>
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-3">
          <Link href="/signin" onClick={handleSignInClick} className="block">
            <Button
              variant="primary"
              className="rounded-[1.4rem] border border-white/20 bg-[image:var(--gradient-brand-action)] py-4 text-lg font-semibold text-white shadow-[var(--shadow-brand-action-lg)] hover:brightness-105 active:brightness-95"
            >
              <span className="flex items-center justify-center gap-2">
                Sign In
                <ArrowRight className="size-5" />
              </span>
            </Button>
          </Link>
          <Link href="/signup" onClick={handleSignUpClick} className="block">
            <Button
              variant="secondary"
              className="rounded-[1.4rem] border border-[color:var(--brand-soft-border)] bg-white/78 py-4 text-lg font-semibold text-slate-900 shadow-[0_12px_32px_rgb(15_23_42/0.08)] backdrop-blur-xl hover:bg-white"
            >
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
