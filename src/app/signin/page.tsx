import { SignInForm } from '@/components/auth';
import { AppFrame } from '@/components/common';

export default function SignInPage() {
  return (
    <AppFrame>
      <div className="flex items-center justify-center flex-1 overflow-y-auto p-4">
        <SignInForm />
      </div>
    </AppFrame>
  );
}
