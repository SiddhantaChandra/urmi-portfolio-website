import { auth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';
import NewArticlePage from '@/components/cms/NewArticlePage';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'New Article',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function NewArticleRoute() {
  const { data: session } = await auth.getSession();

  if (!session || session.user?.role !== 'admin') {
    redirect('/cms/login');
  }

  return <NewArticlePage />;
}
