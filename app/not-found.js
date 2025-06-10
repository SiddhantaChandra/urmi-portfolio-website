"use client";

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { HiHome, HiNewspaper, HiSearch, HiSparkles, HiEye, HiRefresh, HiMail, HiExternalLink } from 'react-icons/hi';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import contentWritingArticles from '../components/ContentWritingData';
import journalArticles from '../components/JournalismData';

// Minimal Navbar Component
const MinimalNavbar = () => {
  const router = useRouter();
  
  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.button
            onClick={() => router.push('/')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 text-lg font-bold"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">UC</span>
            </div>
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Urmi Chakraborty
            </span>
          </motion.button>

          {/* Navigation Links */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <motion.button
              onClick={() => router.push('/')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              <HiHome className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </motion.button>
            
            <motion.button
              onClick={() => router.push('/articles')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              <HiNewspaper className="w-4 h-4" />
              <span className="hidden sm:inline">Articles</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

// Minimal Footer Component
const MinimalFooter = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 py-6"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
            © {currentYear} Urmi Chakraborty. Made with ❤️
          </p>
          
          {/* Quick Links */}
          <div className="flex items-center space-x-4 text-sm">
            <a
              href="mailto:urmichakraborty2022@gmail.com"
              className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              <HiMail className="w-4 h-4" />
              <span className="hidden sm:inline">Contact</span>
            </a>
            <a
              href="https://www.linkedin.com/in/urmichakraborty/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              <HiExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default function NotFound() {
  const router = useRouter();
  const [floatingElements, setFloatingElements] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get recent articles
  const allArticles = [...contentWritingArticles, ...journalArticles].slice(0, 6);
  const filteredArticles = allArticles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Generate floating elements
  useEffect(() => {
    const elements = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 10,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 5,
    }));
    setFloatingElements(elements);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const bounceVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 10,
        delay: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/50 dark:from-gray-900 dark:via-purple-900/10 dark:to-gray-800 font-sans transition-colors duration-500">
      {/* Minimal Header */}
      <MinimalNavbar />
      
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {floatingElements.map((element) => (
          <motion.div
            key={element.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.2, 0],
              scale: [0, 1, 0],
              x: [element.x + '%', (element.x + 20) + '%', element.x + '%'],
              y: [element.y + '%', (element.y - 20) + '%', element.y + '%'],
              rotate: [0, 360, 720],
            }}
            transition={{
              duration: element.duration,
              repeat: Infinity,
              delay: element.delay,
              ease: "easeInOut",
            }}
            className="absolute rounded-full bg-gradient-to-r from-purple-400 to-pink-400 dark:from-purple-500 dark:to-pink-500 opacity-20"
            style={{
              width: element.size,
              height: element.size,
              left: `${element.x}%`,
              top: `${element.y}%`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 min-h-screen pt-20 pb-8"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* 404 Hero Section */}
          <div className="text-center mb-12 sm:mb-16">
            {/* Animated 404 */}
            <motion.div 
              variants={bounceVariants}
              className="relative mb-6 sm:mb-8"
            >
              <motion.h1 
                className="text-6xl sm:text-8xl lg:text-9xl xl:text-[10rem] font-black text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400 bg-clip-text"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  backgroundSize: '200% 200%'
                }}
              >
                404
              </motion.h1>
              
              {/* Floating sparkles around 404 - Mobile optimized */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    x: [0, Math.sin(i * 60 * Math.PI / 180) * 60],
                    y: [0, Math.cos(i * 60 * Math.PI / 180) * 60],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeInOut"
                  }}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                >
                  <HiSparkles className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-400" />
                </motion.div>
              ))}
            </motion.div>

            {/* Error Message */}
            <motion.div variants={itemVariants} className="mb-6 sm:mb-8 px-4">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
                Oops! Page Not Found
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                This page went on a vacation! 🏖️ But hey, let&apos;s find you some amazing content instead.
              </p>
            </motion.div>

            {/* Action Buttons - Mobile optimized */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-12 sm:mb-16 px-4"
            >
              <motion.button
                onClick={() => router.push('/')}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg"
              >
                <HiHome className="w-5 h-5" />
                Back to Home
              </motion.button>
              
              <motion.button
                onClick={() => router.push('/articles')}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 px-6 sm:px-8 py-3 rounded-lg font-semibold border-2 border-purple-200 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-lg"
              >
                <HiNewspaper className="w-5 h-5" />
                View Articles
              </motion.button>
            </motion.div>
          </div>

          {/* Search & Articles Section */}
          <motion.div variants={itemVariants} className="mb-12 sm:mb-16">
            <div className="text-center mb-6 sm:mb-8 px-4">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Maybe You&apos;re Looking For These?
              </h3>
              
              {/* Search Bar */}
              <div className="max-w-md mx-auto relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-12 bg-white dark:bg-gray-800 border-2 border-purple-200 dark:border-purple-700 rounded-lg focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 transition-colors text-sm sm:text-base"
                />
                <HiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Articles Grid - Mobile optimized */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredArticles.map((article, index) => (
                <motion.div
                  key={article.id || article.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 cursor-pointer group"
                  onClick={() => {
                    const href = `/articles/${article.slug}`;
                    router.push(href);
                  }}
                >
                  {/* Article Image */}
                  <div className="relative h-40 sm:h-48 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20">
                    {article.featuredImage ? (
                      <Image
                        src={article.featuredImage}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                          <HiNewspaper className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    )}
                    
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 bg-white/90 dark:bg-gray-800/90 text-purple-600 dark:text-purple-400 text-xs font-medium rounded-md backdrop-blur-sm">
                        {article.category}
                      </span>
                    </div>
                  </div>

                  {/* Article Content */}
                  <div className="p-4 sm:p-6">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2 text-sm sm:text-base">
                      {article.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                      <div className="flex items-center gap-1">
                        <HiEye className="w-3 h-3" />
                        <span>{article.readingTime ? `${article.readingTime} min` : 'Quick read'}</span>
                      </div>
                      <span className="text-purple-600 dark:text-purple-400 font-medium">Read →</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredArticles.length === 0 && searchQuery && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 sm:py-12 px-4"
              >
                <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                  No articles found matching &ldquo;<span className="font-semibold">{searchQuery}</span>&rdquo;. Try a different search term!
                </p>
              </motion.div>
            )}
          </motion.div>
          
        </div>
      </motion.main>

      {/* Minimal Footer */}
      <MinimalFooter />
    </div>
  );
} 