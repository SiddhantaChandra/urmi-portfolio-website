"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiClock, HiUser, HiArrowLeft, HiShare, HiSparkles, HiEye, HiHome, HiChevronRight, HiDocumentText } from 'react-icons/hi';
import { useRouter } from 'next/navigation';
import { cn } from '../../../utils/cn';
import Image from 'next/image';
import RecommendedArticles from '../../../components/RecommendedArticles';

// Breadcrumb Component
const Breadcrumb = ({ article }) => {
  const router = useRouter();
  
  return (
    <nav aria-label="Breadcrumb" className="mb-4 md:mb-6">
      <ol className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm text-gray-600 dark:text-gray-400 overflow-x-auto">
        <li className="flex-shrink-0">
          <button
            onClick={() => router.push('/')}
            className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 flex items-center"
          >
            <HiHome className="w-3 h-3 md:w-4 md:h-4 mr-1" />
            <span className="hidden sm:inline">Home</span>
          </button>
        </li>
        <li className="flex-shrink-0">
          <HiChevronRight className="w-3 h-3 md:w-4 md:h-4" />
        </li>
        <li className="flex-shrink-0">
          <button
            onClick={() => router.push('/articles')}
            className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
          >
            Articles
          </button>
        </li>
        <li className="flex-shrink-0">
          <HiChevronRight className="w-3 h-3 md:w-4 md:h-4" />
        </li>
        <li className="flex-shrink-0">
          <span className="text-gray-900 dark:text-gray-100 font-medium">
            {article.category}
          </span>
        </li>
        <li className="flex-shrink-0 hidden md:block">
          <HiChevronRight className="w-4 h-4" />
        </li>
        <li className="min-w-0 hidden md:block">
          <span className="text-gray-500 dark:text-gray-400 truncate">
            {article.title}
          </span>
        </li>
      </ol>
    </nav>
  );
};

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
              loading="lazy"
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

export default function ArticleClient({ article }) {
  const router = useRouter();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href
        });
      } catch (error) {
        // Fallback for older browsers
        navigator.clipboard?.writeText(window.location.href);
        alert('Article link copied to clipboard!');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="relative min-h-screen font-sans bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-grid-slate-100/50 dark:bg-grid-slate-700/20 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] pointer-events-none" />
      
      {/* Spotlight Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-300 to-pink-300 dark:from-purple-500/30 dark:to-pink-500/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-12 dark:opacity-6 animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-300 to-cyan-300 dark:from-blue-500/30 dark:to-cyan-500/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-12 dark:opacity-6 animate-pulse-slower" />
      </div>

      {/* Floating Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.3, 0],
              scale: [0, 1, 0],
              x: [0, Math.random() * 60 - 30],
              y: [0, Math.random() * 60 - 30],
            }}
            transition={{
              duration: 18 + i * 3,
              repeat: Infinity,
              delay: i * 4,
              ease: "easeInOut",
            }}
            className={cn(
              "absolute rounded-lg bg-gradient-to-r from-purple-400 to-pink-400 dark:from-purple-500 dark:to-pink-500 opacity-8 dark:opacity-4",
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
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-2 md:py-3">
          {/* Mobile Layout */}
          <div className="flex items-center justify-between md:hidden">
            <motion.button
              onClick={() => router.back()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-300 p-2 -ml-2"
            >
              <HiArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back</span>
            </motion.button>

            <motion.button
              onClick={handleShare}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg text-sm font-medium transition-colors duration-300"
            >
              <HiShare className="w-3 h-3" />
              Share
            </motion.button>
          </div>

          {/* Mobile Category Badge */}
          <div className="flex justify-center mt-2 md:hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-200/50 dark:border-purple-500/30 shadow-sm"
            >
              <HiSparkles className="w-3 h-3 text-purple-600 dark:text-purple-400" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {article.category}
              </span>
            </motion.div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between">
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
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-200/50 dark:border-purple-500/30 shadow-lg"
              >
                <HiSparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {article.category}
                </span>
              </motion.div>
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
      <article className="relative z-10 max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-6 md:py-12">
        {/* Breadcrumb Navigation */}
        <Breadcrumb article={article} />
        
        {/* Featured Image */}
        {article.featuredImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="mb-6 md:mb-8 relative rounded-xl overflow-hidden shadow-lg"
          >
            <Image
              src={article.featuredImage}
              alt={article.title}
              width={900}
              height={600}
              className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover object-center"
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
          className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 md:mb-6 leading-tight font-sans"
        >
          {article.title}
        </motion.h1>

        {/* Article Meta */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, delay: 0.1 }}
          className="flex flex-wrap items-center gap-3 md:gap-6 mb-6 md:mb-8 pb-6 md:pb-8 border-b border-purple-200/50 dark:border-purple-500/30 text-sm md:text-base"
        >
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <HiUser className="w-3 h-3 md:w-4 md:h-4" />
            <span className="font-medium">{article.author}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <HiClock className="w-3 h-3 md:w-4 md:h-4" />
            <span>{article.readingTime} min read</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <HiEye className="w-3 h-3 md:w-4 md:h-4" />
            <span>{article.category}</span>
          </div>
        </motion.div>

        {/* Article Excerpt */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, delay: 0.15 }}
          className="mb-8 md:mb-12"
        >
          <div className="bg-purple-50/50 dark:bg-purple-900/20 backdrop-blur-sm rounded-lg p-4 md:p-6 border-l-4 border-purple-600 dark:border-purple-400">
            <p className="text-base md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed font-light italic">
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
          className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-purple-200/50 dark:border-purple-500/30"
        >
          <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 md:mb-4 font-sans">Tags</h3>
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
          className="mt-8 md:mt-12 text-center"
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

      {/* Recommended Articles */}
      <RecommendedArticles 
        currentArticleSlug={article?.slug} 
        currentArticleId={article?.id} 
      />

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
        
        .dark .bg-grid-slate-700\\/20 {
          background-image: linear-gradient(rgba(71, 85, 105, 0.2) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(71, 85, 105, 0.2) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
    </div>
  );
} 