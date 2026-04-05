'use client';

import Image from 'next/image';
import { ReactNode } from 'react';
import { FlickeringGrid } from '@/components/ui/flickering-grid';

interface AuthEntryShellProps {
  title: string;
  children: ReactNode;
}

export const AuthEntryShell = ({ title, children }: AuthEntryShellProps) => {
  return (
    <div className="relative flex flex-1 overflow-y-auto bg-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_14%,rgb(140_103_255/0.04),transparent_32%)]" />
        <FlickeringGrid
          className="absolute inset-0 opacity-14 [mask-image:radial-gradient(circle_at_50%_20%,black_0%,black_16%,transparent_52%)]"
          squareSize={6}
          gridGap={12}
          color="rgb(140, 103, 255)"
          maxOpacity={0.04}
          flickerChance={0.05}
        />
      </div>

      <div className="relative flex min-h-full w-full items-center justify-center px-6 py-[calc(env(safe-area-inset-top)+1rem)]">
        <div className="animate-fade-in flex w-full max-w-[24rem] flex-col items-center gap-5 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 scale-[1.08] rounded-full bg-[radial-gradient(circle,_rgb(140_103_255/0.12)_0%,_transparent_72%)] blur-2xl" />
              <Image
                src="/parrot-logo.png"
                alt="ParrotKit"
                width={88}
                height={88}
                className="relative size-[5.5rem] sm:size-[5.75rem]"
                priority
              />
            </div>
            <h1 className="gradient-text pb-1 text-[2.35rem] leading-[1.08] font-bold tracking-[-0.04em] sm:text-[2.7rem]">
              {title}
            </h1>
          </div>

          <div className="w-full">{children}</div>
        </div>
      </div>
    </div>
  );
};
