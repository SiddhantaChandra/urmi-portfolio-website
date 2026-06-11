import { auth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';

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
    <div className="max-w-7xl mx-auto">
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
    </div>
  );
}
