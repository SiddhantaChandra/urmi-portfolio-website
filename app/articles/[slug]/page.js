import contentWritingArticles from '../../../components/ContentWritingData.js';
import Link from 'next/link';

// SEO Metadata function
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const article = contentWritingArticles.find(
    article => article.slug === resolvedParams.slug
  );

  if (!article) {
    return {
      title: 'Article Not Found | Urmi Chakraborty',
      description: 'The article you are looking for could not be found.',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://urmichakraborty.com';
  const articleUrl = `${siteUrl}/articles/${article.slug}`;

  return {
    title: `${article.title} | Urmi Chakraborty`,
    description: article.excerpt.length > 160 ? article.excerpt.substring(0, 157) + '...' : article.excerpt,
    keywords: article.tags?.join(', '),
    authors: [{ name: article.author }],
    creator: article.author,
    publisher: 'Urmi Chakraborty',
    alternates: {
      canonical: articleUrl,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: articleUrl,
      siteName: 'Urmi Chakraborty',
      images: [
        {
          url: article.featuredImage,
          width: 800,
          height: 600,
          alt: article.title,
        },
      ],
      locale: 'en_US',
      type: 'article',
      authors: [article.author],
      section: article.category,
      tags: article.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [article.featuredImage],
      creator: '@urmic660',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// Structured Data Component
function StructuredData({ article }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://urmichakraborty.com';
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.excerpt,
    "image": {
      "@type": "ImageObject",
      "url": article.featuredImage,
      "width": 800,
      "height": 400
    },
    "author": {
      "@type": "Person",
      "name": article.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Your Site Name",
      "logo": {
        "@type": "ImageObject",
        "url": `https://urmichakraborty.com/_next/image?url=%2Flogo.webp&w=48&q=75`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${siteUrl}/articles/${article.slug}`
    },
    "articleSection": article.category,
    "keywords": article.tags?.join(', '),
    "wordCount": article.content?.reduce((count, block) => {
      if (block.type === 'paragraph') {
        return count + block.content.split(' ').length;
      }
      return count;
    }, 0) || 0,
    "timeRequired": `PT${article.readingTime}M`,
    "url": `${siteUrl}/articles/${article.slug}`
  };

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Articles",
        "item": `${siteUrl}/articles`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": article.category,
        "item": `${siteUrl}/articles?category=${encodeURIComponent(article.category)}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": article.title,
        "item": `${siteUrl}/articles/${article.slug}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData)
        }}
      />
    </>
  );
}

// Loading component for not found articles
function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center font-sans">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Article Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">The article you&apos;re looking for doesn&apos;t exist.</p>
        <Link
          href="/"
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg transition-colors duration-300 inline-block"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default async function ArticlePage({ params }) {
  const resolvedParams = await params;
  const article = contentWritingArticles.find(
    article => article.slug === resolvedParams.slug
  );

  if (!article) {
    return <NotFoundPage />;
  }

  // Import the client component dynamically
  const { default: ArticleClient } = await import('./ArticleClient');

  return (
    <>
      <StructuredData article={article} />
      <ArticleClient article={article} />
    </>
  );
} 