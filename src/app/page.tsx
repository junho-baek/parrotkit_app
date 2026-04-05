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
    <div className="relative flex flex-1 overflow-y-auto bg-[#fbfaf7]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgb(140_103_255/0.11),transparent_34%)]" />
        <FlickeringGrid
          className="absolute inset-0 opacity-45 [mask-image:radial-gradient(circle_at_50%_30%,black_0%,black_22%,transparent_62%)]"
          squareSize={6}
          gridGap={12}
          color="rgb(140, 103, 255)"
          maxOpacity={0.09}
          flickerChance={0.08}
        />
      </div>

      <div className="relative flex min-h-full w-full flex-col justify-between px-6 pb-[calc(env(safe-area-inset-bottom)+2rem)] pt-[calc(env(safe-area-inset-top)+1.75rem)]">
        <section className="flex flex-1 flex-col items-center justify-center">
          <div className="animate-fade-in flex w-full max-w-[22rem] flex-col items-center gap-6 text-center">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 scale-[1.2] rounded-full bg-[radial-gradient(circle,_rgb(140_103_255/0.18)_0%,_transparent_68%)] blur-2xl" />
              <Image
                src="/parrot-logo.png"
                alt="ParrotKit"
                width={132}
                height={132}
                className="relative size-[8.25rem]"
                priority
              />
            </div>

            <div className="flex flex-col items-center gap-3">
              <h1 className="text-[3.6rem] font-black tracking-[-0.055em] text-slate-950 sm:text-[4.1rem]">
                ParrotKit
              </h1>
              <p className="max-w-[18rem] text-[1.06rem] font-semibold leading-[1.35] tracking-[-0.02em] text-slate-700 sm:text-[1.15rem]">
                Turn viral videos into remake-ready scripts.
              </p>
              <p className="text-[0.72rem] font-medium uppercase tracking-[0.24em] text-slate-400">
                For UGC creators
              </p>
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-3">
          <Link href="/signin" onClick={handleSignInClick} className="block">
            <Button
              variant="primary"
              className="brand-primary-button rounded-[1.35rem] py-4 text-lg font-semibold"
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
              className="rounded-[1.35rem] border border-slate-200 bg-transparent py-4 text-lg font-semibold text-slate-800 transition-colors duration-200 hover:bg-white/70"
            >
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
