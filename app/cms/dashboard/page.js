import { auth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'CMS Dashboard',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DashboardPage() {
  const { data: session } = await auth.getSession();

  if (!session) {
    redirect('/cms/login');
  }

  const role = session.user?.role;
  if (role !== 'admin') {
    redirect('/');
  }

  return (
    <main className="min-h-screen bg-neutral-bg dark:bg-neutral-bg-dark text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome to the CMS</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Logged in as {session.user?.email} ({role})
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <h2 className="text-xl font-semibold mb-2">Articles</h2>
            <p className="text-gray-600 dark:text-gray-400">Manage your articles and content.</p>
          </div>

          <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <h2 className="text-xl font-semibold mb-2">SEO</h2>
            <p className="text-gray-600 dark:text-gray-400">Optimize search engine visibility.</p>
          </div>

          <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <h2 className="text-xl font-semibold mb-2">Analytics</h2>
            <p className="text-gray-600 dark:text-gray-400">View traffic and engagement stats.</p>
          </div>
        </div>

        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Portfolio
          </Link>
        </div>
      </div>
    </main>
  );
}
