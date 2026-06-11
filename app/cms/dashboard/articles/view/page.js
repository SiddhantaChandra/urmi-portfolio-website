import { auth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'View Articles',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ViewArticlesPage() {
  const { data: session } = await auth.getSession();

  if (!session) {
    redirect('/cms/login');
  }

  const role = session.user?.role;
  if (role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">View Articles</h1>
      <div className="p-8 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-center text-gray-500 dark:text-gray-400">
        Articles viewer coming soon.
      </div>
    </div>
  );
}
