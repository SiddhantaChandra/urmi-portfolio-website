import { auth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';
import { getProfile } from '@/app/actions/db';
import HeroEditorPage from '@/components/cms/HeroEditorPage';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Edit Hero Section',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function EditHeroPage() {
  const { data: session } = await auth.getSession();

  if (!session || session.user?.role !== 'admin') {
    redirect('/cms/login');
  }

  const profile = await getProfile();

  return <HeroEditorPage initialProfile={profile} />;
}
