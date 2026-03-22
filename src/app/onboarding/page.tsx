import { OnboardingForm } from '@/components/auth';

export default function OnboardingPage() {
  return (
    <div className="flex h-full flex-col bg-[radial-gradient(circle_at_top,_rgba(255,149,104,0.16),_transparent_28%),linear-gradient(180deg,_#fffdfd_0%,_#fff_42%,_#fff8fc_100%)]">
      <div className="sticky top-0 z-10 flex-shrink-0 border-b border-white/80 bg-white/92 px-4 py-2.5 backdrop-blur-xl">
        <h1 className="text-center text-lg font-bold tracking-[-0.03em] text-gray-900">Get Started</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-3.5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] pt-3">
        <div className="mx-auto w-full max-w-md">
          <OnboardingForm />
        </div>
      </div>
    </div>
  );
}
