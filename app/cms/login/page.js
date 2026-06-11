'use client';

import { AuthView } from '@neondatabase/auth-ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { authClient } from '@/lib/auth/client';

export default function LoginPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  // Redirect already-authenticated users
  useEffect(() => {
    if (session?.user) {
      const role = session.user.role;
      if (role === 'admin') {
        router.push('/cms/dashboard');
      } else {
        authClient.signOut();
        router.push('/');
      }
    }
  }, [session, router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-bg dark:bg-neutral-bg-dark px-4">
      <div className="w-full max-w-md">
        <AuthView pathname="sign-in" redirectTo="/cms/dashboard" />
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don&apos;t have an account?{' '}
            <Link
              href="/cms/signup"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
