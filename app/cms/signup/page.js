import { AuthView } from '@neondatabase/auth-ui';
import Link from 'next/link';

export const metadata = {
  title: 'CMS Sign Up',
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignUpPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-bg dark:bg-neutral-bg-dark px-4">
      <div className="w-full max-w-md">
        <AuthView pathname="sign-up" redirectTo="/cms/dashboard" />
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link
              href="/cms/login"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
