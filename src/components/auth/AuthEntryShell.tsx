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

      <div className="relative flex min-h-full w-full items-center justify-center px-6 pb-[calc(env(safe-area-inset-bottom)+2rem)] pt-[calc(env(safe-area-inset-top)+1.75rem)]">
        <div className="animate-fade-in flex w-full max-w-[22rem] flex-col items-center gap-8 text-center">
          <div className="flex flex-col items-center gap-5">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 scale-[1.2] rounded-full bg-[radial-gradient(circle,_rgb(140_103_255/0.18)_0%,_transparent_68%)] blur-2xl" />
              <Image
                src="/parrot-logo.png"
                alt="ParrotKit"
                width={120}
                height={120}
                className="relative size-[7.5rem]"
                priority
              />
            </div>
            <h1 className="text-[3rem] font-black tracking-[-0.05em] text-slate-950 sm:text-[3.35rem]">
              {title}
            </h1>
          </div>

          <div className="w-full">{children}</div>
        </div>
      </div>
    </div>
  );
};
