import { OnboardingForm } from '@/components/auth';
import { AppFrame } from '@/components/common';

export default function OnboardingPage() {
  return (
    <AppFrame>
      <div className="flex flex-col h-full">
        {/* Mobile App Style Header */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-center">
          <h1 className="text-xl font-bold text-gray-900">Get Started</h1>
        </div>
        
        <div className="flex-1 overflow-y-auto flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <OnboardingForm />
          </div>
        </div>
      </div>
    </AppFrame>
  );
}
