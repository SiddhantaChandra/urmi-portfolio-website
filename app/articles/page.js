"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiSearch, HiEye, HiClock, HiCalendar, HiTag, HiArrowLeft, HiExternalLink, HiNewspaper, HiPencil, HiSparkles } from 'react-icons/hi';
import { useRouter } from 'next/navigation';
import { cn } from '../../utils/cn';
import Image from 'next/image';
import contentWritingArticles from '../../components/ContentWritingData';
import journalArticles from '../../components/JournalismData';

const Articles = () => {
  const [allArticles, setAllArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const router = useRouter();

  // Combine and normalize article data
  useEffect(() => {
    // Convert articles to normalized format
    const contentArticles = contentWritingArticles.map(article => ({
      ...article,
      type: 'content-writing',
      articleType: 'Content Writing',
      link: `/articles/${article.slug}`,
      isExternal: false
    }));

    const journalismArticles = journalArticles.map(article => ({
      ...article,
      id: article.title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      slug: article.title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      type: 'journalism',
      excerpt: article.subHeading,
      featuredImage: article.image,
      publishedDate: '2023-01-01', // Default date for journalism articles
      readingTime: 5, // Default reading time
      author: 'Urmi Chakraborty',
      isExternal: true
    }));

    // Create alternating pattern
    const createAlternatingArticles = () => {
      const alternating = [];
      const maxLength = Math.max(contentArticles.length, journalismArticles.length);
      
      for (let i = 0; i < maxLength; i++) {
        if (i < contentArticles.length) {
          alternating.push(contentArticles[i]);
        }
        if (i < journalismArticles.length) {
          alternating.push(journalismArticles[i]);
        }
      }
      
      return alternating;
    };

    const combinedArticles = createAlternatingArticles();

    setAllArticles(combinedArticles);
    setFilteredArticles(combinedArticles);
  }, []);

  // Filter articles based on search and filters
  useEffect(() => {
    let filtered = allArticles.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
      const matchesType = selectedType === 'all' || article.type === selectedType;

      return matchesSearch && matchesCategory && matchesType;
    });

    setFilteredArticles(filtered);
  }, [searchTerm, selectedCategory, selectedType, allArticles]);

  // Get unique categories for the category filter
  const categories = ['all', ...new Set(allArticles.map(article => article.category).filter(Boolean))];

  const handleArticleClick = (article) => {
    if (article.isExternal) {
      window.open(article.link, '_blank');
    } else {
      router.push(article.link);
    }
  };

  const tabs = [
    { id: 'all', label: 'All Work', icon: HiEye },
    { id: 'content-writing', label: 'Content Writing', icon: HiPencil },
    { id: 'journalism', label: 'Journalism', icon: HiNewspaper }
  ];

  return (
    <div className="relative min-h-screen font-sans bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-grid-slate-100/50 dark:bg-grid-slate-700/20 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] pointer-events-none" />
      
      {/* Spotlight Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-300 to-pink-300 dark:from-purple-500/30 dark:to-pink-500/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-15 dark:opacity-8 animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-300 to-cyan-300 dark:from-blue-500/30 dark:to-cyan-500/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-15 dark:opacity-8 animate-pulse-slower" />
      </div>

      {/* Floating Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.4, 0],
              scale: [0, 1, 0],
              x: [0, Math.random() * 60 - 30],
              y: [0, Math.random() * 60 - 30],
            }}
            transition={{
              duration: 15 + i * 3,
              repeat: Infinity,
              delay: i * 3,
              ease: "easeInOut",
            }}
            className={cn(
              "absolute rounded-lg bg-gradient-to-r from-purple-400 to-pink-400 dark:from-purple-500 dark:to-pink-500 opacity-10 dark:opacity-5",
              i % 2 === 0 ? "w-4 h-4" : "w-6 h-6"
            )}
            style={{
              left: `${10 + (i * 20)}%`,
              top: `${20 + (i * 15)}%`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-purple-200/50 dark:border-purple-500/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <motion.button
              onClick={() => router.push('/')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-300"
            >
              <HiArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </motion.button>

            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-200/50 dark:border-purple-500/30 shadow-lg mb-2"
              >
                <HiSparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Portfolio & Articles
                </span>
              </motion.div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400 bg-clip-text text-transparent">
                  My Work & Impact
                </span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                From entertainment journalism to strategic content writing
              </p>
            </div>

            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
                <HiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={cn(
                    "w-full pl-12 pr-4 py-3 rounded-lg text-gray-900 dark:text-gray-100",
                    "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm",
                    "border border-purple-200/50 dark:border-purple-500/30",
                    "focus:ring-2 focus:ring-purple-500 focus:border-transparent",
                    "shadow-lg hover:shadow-xl transition-all duration-300"
                  )}
                />
              </motion.div>
            </div>

            {/* Tab Switcher */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-1 border border-purple-200/50 dark:border-purple-500/30 shadow-lg flex w-full max-w-xl">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setSelectedType(tab.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "flex items-center justify-center gap-2 px-4 py-3 rounded-md text-sm font-medium transition-all duration-300 flex-1",
                      selectedType === tab.id
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 text-white shadow-lg"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white/50 dark:hover:bg-gray-700/50"
                    )}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Results Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-8"
        >
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Showing <span className="font-semibold text-purple-600 dark:text-purple-400">{filteredArticles.length}</span> of <span className="font-semibold">{allArticles.length}</span> articles
            {selectedType !== 'all' && (
              <span className="ml-1">
                in <span className="font-semibold text-purple-600 dark:text-purple-400">{tabs.find(t => t.id === selectedType)?.label}</span>
              </span>
            )}
            {searchTerm && (
              <span className="ml-1">
                for <span className="font-semibold text-purple-600 dark:text-purple-400">&quot;{searchTerm}&quot;</span>
              </span>
            )}
          </p>
        </motion.div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                onClick={() => handleArticleClick(article)}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg border border-purple-200/50 dark:border-purple-500/30 overflow-hidden group cursor-pointer"
              >
                {/* Article Image */}
                <div className="relative h-48 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 overflow-hidden">
                  <Image
                    src={article.featuredImage || article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  
                  {/* Type Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={cn(
                      "px-3 py-1 text-xs font-medium rounded-full backdrop-blur-sm",
                      article.type === 'content-writing' 
                        ? "bg-blue-100/90 dark:bg-blue-900/70 text-blue-700 dark:text-blue-300" 
                        : "bg-purple-100/90 dark:bg-purple-900/70 text-purple-700 dark:text-purple-300"
                    )}>
                      {article.articleType}
                    </span>
                  </div>

                  {/* External Link Indicator */}
                  {article.isExternal && (
                    <div className="absolute top-4 right-4">
                      <div className="p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full">
                        <HiExternalLink className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </div>
                    </div>
                  )}

                  {/* Category Badge */}
                  {article.category && (
                    <div className="absolute bottom-4 right-4">
                      <span className="px-2 py-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-xs font-medium text-gray-700 dark:text-gray-300 rounded-full">
                        {article.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* Article Content */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300 line-clamp-2 font-sans">
                      {article.title}
                    </h3>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed font-sans">
                    {article.excerpt}
                  </p>

                  {/* Article Meta */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <HiCalendar className="w-4 h-4" />
                      <span>{new Date(article.publishedDate).toLocaleDateString()}</span>
                    </div>
                    {article.readingTime && (
                      <div className="flex items-center gap-1">
                        <HiClock className="w-4 h-4" />
                        <span>{article.readingTime} min read</span>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {article.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-gray-100/80 dark:bg-gray-700/80 text-gray-600 dark:text-gray-300 text-xs rounded-md font-sans"
                        >
                          {tag}
                        </span>
                      ))}
                      {article.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100/80 dark:bg-gray-700/80 text-gray-500 dark:text-gray-400 text-xs rounded-md font-sans">
                          +{article.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Action Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 w-full justify-center",
                      article.type === 'journalism'
                        ? "bg-purple-50/80 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-100/80 dark:hover:bg-purple-900/50"
                        : "bg-blue-50/80 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100/80 dark:hover:bg-blue-900/50"
                    )}
                  >
                    {article.isExternal ? (
                      <>
                        <HiExternalLink className="w-4 h-4" />
                        Read Article
                      </>
                    ) : (
                      <>
                        <HiEye className="w-4 h-4" />
                        Read Full Article
                      </>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* No Results */}
        {filteredArticles.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-8 border border-purple-200/50 dark:border-purple-500/30 shadow-lg max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No articles found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Try adjusting your search terms or changing the selected category
              </p>
              <motion.button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedType('all');
                }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg"
              >
                Clear All Filters
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Articles; 