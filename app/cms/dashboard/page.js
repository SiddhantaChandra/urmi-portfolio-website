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
      <div className="cms-page-header">
        <div>
          <p className="cms-eyebrow">Overview</p>
          <h1 className="cms-page-title">Welcome to the editorial dashboard</h1>
          <p className="cms-page-subtitle">
          Logged in as {session.user?.email} ({role})
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="cms-card p-6">
          <p className="cms-eyebrow">Publishing</p>
          <h2 className="text-xl font-semibold mt-3 text-[var(--cms-ink)]">Articles</h2>
          <p className="cms-muted mt-2">Manage internal articles, external links, drafts, and public publishing state.</p>
        </div>

        <div className="cms-card p-6">
          <p className="cms-eyebrow">Presence</p>
          <h2 className="text-xl font-semibold mt-3 text-[var(--cms-ink)]">SEO</h2>
          <p className="cms-muted mt-2">Keep the public profile polished with better metadata, summaries, and content hygiene.</p>
        </div>

        <div className="cms-card p-6">
          <p className="cms-eyebrow">Signals</p>
          <h2 className="text-xl font-semibold mt-3 text-[var(--cms-ink)]">Analytics</h2>
          <p className="cms-muted mt-2">Use this space for portfolio performance and engagement tooling as the CMS expands.</p>
        </div>
      </div>
    </div>
  );
}
