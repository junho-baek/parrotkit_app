import { SignUpForm } from '@/components/auth';
import { AppFrame } from '@/components/common';

export default function SignUpPage() {
  return (
    <AppFrame>
      <div className="flex items-center justify-center flex-1 overflow-y-auto p-4">
        <SignUpForm />
      </div>
    </AppFrame>
  );
}
