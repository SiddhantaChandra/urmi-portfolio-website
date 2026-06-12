import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/server';
import ArticleEditorPage from '@/components/cms/ArticleEditorPage';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  return {
    title: 'Edit Article',
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function EditArticleRoute({ params }) {
  const { data: session } = await auth.getSession();

  if (!session || session.user?.role !== 'admin') {
    redirect('/cms/login');
  }

  const resolvedParams = await params;
  const article = await prisma.article.findUnique({
    where: { id: resolvedParams.id },
    include: {
      tags: {
        include: { tag: true },
      },
    },
  });

  if (!article) {
    redirect('/cms/dashboard/articles');
  }

  return <ArticleEditorPage article={article} />;
}
