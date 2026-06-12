import prisma from '@/lib/prisma';

export default async function sitemap() {
  const baseUrl = 'https://urmichakraborty.com';
  const currentDate = new Date();
  
  // Static pages with high priority
  const staticPages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  // Dynamic article pages from database
  const articles = await prisma.article.findMany({
    where: { status: 'published' },
    select: { slug: true, updatedAt: true },
  });

  const articlePages = articles.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: article.updatedAt || currentDate,
    changeFrequency: 'yearly',
    priority: 0.8,
  }));

  // Combine all pages
  const allPages = [...staticPages, ...articlePages];

  return allPages;
} 
