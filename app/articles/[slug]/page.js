"use client";

import { useState, useEffect } from 'react';
import { use } from 'react';
import { motion } from 'framer-motion';
import { HiClock, HiCalendar, HiUser, HiArrowLeft, HiShare, HiSparkles, HiEye } from 'react-icons/hi';
import { useRouter } from 'next/navigation';
import { cn } from '../../../utils/cn';
import contentWritingArticles from '../../../components/ContentWritingData';
import Image from 'next/image';

// Content Block Renderer Component
const ContentBlock = ({ block, index }) => {
  switch (block.type) {
    case 'paragraph':
      return (
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, delay: index * 0.01 }}
          viewport={{ once: true }}
          className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 text-lg font-sans"
        >
          {block.content}
        </motion.p>
      );

    case 'heading':
      const HeadingTag = `h${block.level}`;
      const headingClasses = {
        1: "text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8 mt-12",
        2: "text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 mt-10",
        3: "text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4 mt-8",
        4: "text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3 mt-6"
      };

      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, delay: index * 0.01 }}
          viewport={{ once: true }}
        >
          <HeadingTag className={cn(headingClasses[block.level], "font-sans")}>
            {block.content}
          </HeadingTag>
        </motion.div>
      );

    case 'image':
      return (
        <motion.figure 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="my-8"
        >
          <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={block.src}
              alt={block.alt}
              fill
              className="object-cover"
            />
          </div>
          {block.caption && (
            <figcaption className="text-center text-sm text-gray-600 dark:text-gray-400 mt-3 italic font-sans">
              {block.caption}
            </figcaption>
          )}
        </motion.figure>
      );

    case 'list':
      const ListTag = block.listType === 'numbered' ? 'ol' : 'ul';
      const listClasses = block.listType === 'numbered' 
        ? "list-decimal list-inside space-y-2 mb-6 ml-4"
        : "list-disc list-inside space-y-2 mb-6 ml-4";

      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <ListTag className={listClasses}>
            {block.items.map((item, index) => (
              <motion.li 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-gray-700 dark:text-gray-300 leading-relaxed font-sans"
              >
                {item}
              </motion.li>
            ))}
          </ListTag>
        </motion.div>
      );

    case 'quote':
      return (
        <motion.blockquote 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, delay: index * 0.01 }}
          viewport={{ once: true }}
          className="border-l-4 border-purple-600 dark:border-purple-400 pl-6 py-4 my-8 bg-purple-50/50 dark:bg-purple-900/20 rounded-r-lg backdrop-blur-sm italic text-lg text-gray-700 dark:text-gray-300 font-sans"
        >
          {block.content}
        </motion.blockquote>
      );

    default:
      return null;
  }
};

export default function ArticlePage({ params }) {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  // Unwrap params Promise using React.use()
  const resolvedParams = use(params);

  useEffect(() => {
    const foundArticle = contentWritingArticles.find(
      article => article.slug === resolvedParams.slug
    );
    setArticle(foundArticle);
    setLoading(false);
  }, [resolvedParams.slug]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center font-sans">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Article Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">The article you're looking for doesn't exist.</p>
          <motion.button
            onClick={() => router.push('/')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg transition-colors duration-300"
          >
            Back to Home
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen font-sans bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-grid-slate-100/50 dark:bg-grid-slate-700/20 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] pointer-events-none" />
      
      {/* Spotlight Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-300 to-pink-300 dark:from-purple-500/30 dark:to-pink-500/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 dark:opacity-20 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-300 to-cyan-300 dark:from-blue-500/30 dark:to-cyan-500/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 dark:opacity-20 animate-pulse animation-delay-2000" />
      </div>

      {/* Floating Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
            className={cn(
              "absolute rounded-lg bg-gradient-to-r from-purple-400 to-pink-400 dark:from-purple-500 dark:to-pink-500 opacity-20 dark:opacity-10",
              i % 2 === 0 ? "w-4 h-4" : "w-6 h-6"
            )}
            style={{
              left: `${10 + (i * 15)}%`,
              top: `${20 + (i * 10)}%`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-purple-200/50 dark:border-purple-500/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <motion.button
              onClick={() => router.back()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-300"
            >
              <HiArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </motion.button>

            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-200/50 dark:border-purple-500/30 shadow-lg mb-2"
              >
                <HiSparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Content Writing
                </span>
              </motion.div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400 bg-clip-text text-transparent">
                  Article
                </span>
              </h1>
            </div>

            <motion.button
              onClick={handleShare}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-colors duration-300"
            >
              <HiShare className="w-4 h-4" />
              Share
            </motion.button>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <article className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Image */}
        {article.featuredImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="mb-8 relative rounded-xl overflow-hidden shadow-lg"
          >
            <Image
              src={article.featuredImage}
              alt={article.title}
              width={800}
              height={400}
              className="w-full h-64 md:h-80 object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </motion.div>
        )}

        {/* Article Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, delay: 0.05 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight font-sans"
        >
          {article.title}
        </motion.h1>

        {/* Article Meta */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, delay: 0.1 }}
          className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-purple-200/50 dark:border-purple-500/30"
        >
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <HiUser className="w-4 h-4" />
            <span className="font-medium">{article.author}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <HiCalendar className="w-4 h-4" />
            <span>{new Date(article.publishedDate).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <HiClock className="w-4 h-4" />
            <span>{article.readingTime} min read</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <HiEye className="w-4 h-4" />
            <span>{article.category}</span>
          </div>
        </motion.div>

        {/* Article Excerpt */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, delay: 0.15 }}
          className="mb-12"
        >
          <div className="bg-purple-50/50 dark:bg-purple-900/20 backdrop-blur-sm rounded-lg p-6 border-l-4 border-purple-600 dark:border-purple-400">
            <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed font-light italic">
              {article.excerpt}
            </p>
          </div>
        </motion.div>

        {/* Article Content Blocks */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15, delay: 0.2 }}
          className="prose prose-lg max-w-none"
        >
          {article.content?.map((block, index) => (
            <ContentBlock key={index} block={block} index={index} />
          ))}
        </motion.div>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, delay: 0.25 }}
          className="mt-12 pt-8 border-t border-purple-200/50 dark:border-purple-500/30"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 font-sans">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {article.tags?.map((tag, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.1, delay: 0.3 + (index * 0.02) }}
                className="px-3 py-1 bg-purple-100/80 dark:bg-purple-900/70 text-purple-800 dark:text-purple-200 text-sm rounded-full backdrop-blur-sm"
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <motion.button
            onClick={() => router.push('/articles')}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg"
          >
            View More Articles
          </motion.button>
        </motion.div>
      </article>

      {/* CSS for grid background */}
      <style jsx>{`
        .bg-grid-slate-100\\/50 {
          background-image: linear-gradient(rgba(148, 163, 184, 0.5) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(148, 163, 184, 0.5) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        
        .dark .bg-grid-slate-700\\/20 {
          background-image: linear-gradient(rgba(71, 85, 105, 0.2) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(71, 85, 105, 0.2) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
} 