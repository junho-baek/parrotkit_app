import { AuthEntryShell, SignUpForm } from '@/components/auth';

export default function SignUpPage() {
  return (
    <AuthEntryShell title="Create Account">
      <SignUpForm />
    </AuthEntryShell>
  );
}
