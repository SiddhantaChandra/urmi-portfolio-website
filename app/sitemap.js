import contentWritingArticles from '../components/ContentWritingData.js';

export default function sitemap() {
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

  // Dynamic article pages from content writing data
  const articlePages = contentWritingArticles
    .filter(article => article.slug) // Only include articles with slugs
    .map((article) => {
      // Use article's last modified date if available, otherwise use current date
      const lastModified = article.lastModified 
        ? new Date(article.lastModified) 
        : article.publishedDate 
        ? new Date(article.publishedDate)
        : currentDate;

      return {
        url: `${baseUrl}/articles/${article.slug}`,
        lastModified: lastModified,
        changeFrequency: 'yearly', // Articles rarely change once published
        priority: 0.8,
      };
    });

  // Combine all pages
  const allPages = [...staticPages, ...articlePages];

  return allPages;
} 