'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiArrowLeft, HiSparkles, HiClock, HiCalendar, HiEye, HiUser, HiShare, HiHome, HiChevronRight } from 'react-icons/hi';
import { useRouter } from 'next/navigation';
import { cn } from '../../../utils/cn';

// Breadcrumb Component
const Breadcrumb = ({ article }) => {
  const router = useRouter();
  
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
        <li>
          <button
            onClick={() => router.push('/')}
            className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 flex items-center"
          >
            <HiHome className="w-4 h-4 mr-1" />
            Home
          </button>
        </li>
        <li>
          <HiChevronRight className="w-4 h-4" />
        </li>
        <li>
          <button
            onClick={() => router.push('/articles')}
            className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
          >
            Articles
          </button>
        </li>
        <li>
          <HiChevronRight className="w-4 h-4" />
        </li>
        <li>
          <span className="text-gray-900 dark:text-gray-100 font-medium">
            {article.category}
          </span>
        </li>
        <li>
          <HiChevronRight className="w-4 h-4" />
        </li>
        <li>
          <span className="text-gray-500 dark:text-gray-400 truncate max-w-xs">
            {article.title}
          </span>
        </li>
      </ol>
    </nav>
  );
};

export default function MyChatLessonClient({ article }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        if (article) {
          // Parse the content array to extract messages
          const parsedMessages = article.content.map((item, index) => {
            if (item.type === 'paragraph') {
              const colonIndex = item.content.indexOf(':');
              if (colonIndex > 0) {
                const sender = item.content.substring(0, colonIndex).trim();
                const message = item.content.substring(colonIndex + 1).trim();
                return {
                  id: index,
                  sender: sender,
                  message: message,
                  timestamp: new Date(Date.now() + index * 1000).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                };
              }
            }
            return null;
          }).filter(Boolean);
          
          setMessages(parsedMessages);
        } else {
          throw new Error('Article not found');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [article]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article?.title || 'Chat-based script for 8th Standard KSEEB History',
          text: article?.excerpt || 'Interactive educational chat session about Sources of History',
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center transition-colors duration-500 font-sans">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center transition-colors duration-500 font-sans">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Chat</h1>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
          <motion.button
            onClick={() => router.push('/')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-colors duration-300"
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
              duration: 16 + i * 3,
              repeat: Infinity,
              delay: i * 3.5,
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
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
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-200/50 dark:border-purple-500/30 shadow-lg"
              >
                <HiSparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Content Writing
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

      {/* Chat Container */}
      <div className="relative z-10 max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb article={article} />
        
        {/* Article Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, delay: 0.05 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight font-sans"
        >
          {article?.title}
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
            <span className="font-medium">{article?.author}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <HiCalendar className="w-4 h-4" />
            <span>{new Date(article?.publishedDate).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <HiClock className="w-4 h-4" />
            <span>{article?.readingTime} min read</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <HiEye className="w-4 h-4" />
            <span>{article?.category}</span>
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
              {article?.excerpt}
            </p>
          </div>
        </motion.div>

        {/* Chat Messages */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-purple-200/50 dark:border-purple-500/30 shadow-xl p-6 mb-8"
        >
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`flex ${message.sender.toLowerCase().includes('student') ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                  message.sender.toLowerCase().includes('student') 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                }`}>
                  <div className="text-xs opacity-75 mb-1">{message.sender}</div>
                  <div className="text-sm">{message.message}</div>
                  <div className="text-xs opacity-50 mt-1">{message.timestamp}</div>
                </div>
              </motion.div>
            ))}
          </div>
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
            {article?.tags?.map((tag, index) => (
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
      </div>

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
      `}</style>
    </div>
  );
} 