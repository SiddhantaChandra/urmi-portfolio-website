"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiExternalLink, HiEye, HiClock, HiTrendingUp, HiNewspaper, HiPencil, HiArrowRight } from 'react-icons/hi';
import { useRouter } from 'next/navigation';
import { cn } from '../utils/cn';
import journalArticles from '../components/JournalismData';
import contentWritingArticles from '../components/ContentWritingData';

const WorkSection = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
  
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Convert articles to project format
  const contentProjects = contentWritingArticles.map((article, index) => ({
    id: index + 10,
    category: 'content',
    title: article.title,
    description: article.excerpt,
    image: article.featuredImage,
    metrics: article.metrics,
    tags: article.tags,
    link: `/articles/${article.slug}`,
    type: article.category,
    readingTime: article.readingTime
  }));

  const journalismProjects = journalArticles.map((article, index) => ({
    id: index + 20,
    category: 'journalism',
    title: article.title,
    description: article.subHeading,
    image: article.image,
    metrics: article.metrics,
    tags: article.tags,
    link: article.link,
    type: article.articleType
  }));


  const createAlternatingProjects = () => {
    const alternating = [];
    const maxLength = Math.max(contentProjects.length, journalismProjects.length);
    
    for (let i = 0; i < maxLength; i++) {
      if (i < contentProjects.length) {
        alternating.push(contentProjects[i]);
      }
      if (i < journalismProjects.length) {
        alternating.push(journalismProjects[i]);
      }
    }
    
    return alternating;
  };

  const allProjects = createAlternatingProjects();

  const tabs = [
    { id: 'all', label: 'All Work', icon: HiEye },
    { id: 'content', label: 'Content Writing', icon: HiPencil },
    { id: 'journalism', label: 'Journalism', icon: HiNewspaper }
  ];

  const filteredProjects = activeTab === 'all' 
    ? allProjects 
    : activeTab === 'content' 
      ? contentProjects 
      : journalismProjects;

  const getDisplayProjects = () => {
    const limit = isMobile ? 6 : 9;
    return filteredProjects.slice(0, limit);
  };

  return (
    <section id="work" className="py-16 md:py-20 bg-white dark:bg-gray-900 font-sans transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-6 md:mb-8"
        >
          <span className="inline-block px-3 py-1.5 md:px-4 md:py-2 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg text-xs md:text-sm font-medium mb-3 md:mb-4">
            Portfolio
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 md:mb-6 font-sans leading-tight">
            My Work &
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent"> Impact</span>
          </h2>
          <p className="text-base md:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed font-sans">
            From covering developments in the entertainment and city beats to producing content across several niches, here's a showcase of my diverse writing portfolio.
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex justify-center mb-6 md:mb-8 lg:mb-12 px-2 md:px-4"
        >
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1 inline-flex w-full sm:w-auto overflow-x-auto">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "flex items-center gap-1 md:gap-2 px-2 md:px-3 py-2 md:py-3 rounded-md text-xs md:text-sm font-medium transition-all duration-150 whitespace-nowrap flex-1 sm:flex-none justify-center",
                    activeTab === tab.id
                      ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  )}
                >
                  <IconComponent className="hidden sm:inline w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">
                    {tab.id === 'all' ? 'All Work' : tab.id === 'content' ? 'Content Writing' : 'Journalism'}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        
        {/* Desktop/Tablet: Card Grid Layout */}
        <div className="hidden md:block">
          <AnimatePresence mode="wait">
            <motion.div
              key={`desktop-${activeTab}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {getDisplayProjects().map((project, index) => (
                <motion.a
                  key={`desktop-${project.id}`}
                  href={project.link}
                  target={project.category === 'journalism' ? "_blank" : "_self"}
                  rel={project.category === 'journalism' ? "noopener noreferrer" : undefined}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden group cursor-pointer block"
                >
                {/* Project Image */}
                <div className="relative h-48 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 overflow-hidden">
                  {project.image && project.image !== '/api/placeholder/400/300' ? (
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 dark:from-blue-500/30 dark:to-purple-500/30" />
                  )}
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-xs font-medium text-gray-700 dark:text-gray-300 rounded-full">
                      {project.type}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className={cn(
                      "px-3 py-1 text-xs font-medium rounded-full",
                      project.category === 'content' 
                        ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300" 
                        : "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300"
                    )}>
                      {project.category === 'content' ? 'Content Writing' : 'Journalism'}
                    </span>
                  </div>
                </div>

                {/* Project Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 font-sans line-clamp-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4 text-sm font-sans line-clamp-3">
                    {project.description}
                  </p>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {project.metrics.filter(metric => metric.label !== 'Category' && metric.label !== 'Industry' && metric.label !== 'Publication').map((metric, idx) => (
                      <div key={idx} className="text-center">
                        <div className={cn(
                          "text-lg font-bold bg-gradient-to-r bg-clip-text text-transparent font-sans",
                          project.category === 'content' 
                            ? "from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400" 
                            : "from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400"
                        )}>
                          {metric.value}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 font-sans">
                          {metric.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-md font-sans"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded-md font-sans">
                        +{project.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </motion.a>
            ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile: Mixed Layout */}
        <div className="md:hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={`mobile-${activeTab}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 px-2"
            >
            {getDisplayProjects().map((project, index) => {
             
              if (index === 0) {
                return (
                  <motion.a
                    key={`mobile-featured-${project.id}`}
                    href={project.link}
                    target={project.category === 'journalism' ? "_blank" : "_self"}
                    rel={project.category === 'journalism' ? "noopener noreferrer" : undefined}
                                      initial={{ opacity: 0, x: -20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                    className="block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md dark:hover:shadow-gray-900/20 transition-all duration-200 group"
                  >
                    {/* Featured Article Image */}
                    <div className="relative h-32 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 overflow-hidden">
                      {project.image && project.image !== '/api/placeholder/400/300' ? (
                        <img 
                          src={project.image} 
                          alt={project.title}
                          className="w-full h-full object-cover object-center"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 dark:from-blue-500/30 dark:to-purple-500/30 flex items-center justify-center">
                          <HiNewspaper className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                        </div>
                      )}
                    </div>

                    {/* Featured Article Content */}
                    <div className="p-3">
                      <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 leading-tight mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                        {project.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed mb-3">
                        {project.description}
                      </p>

                      {/* Metrics for featured article */}
                      <div className="flex items-center gap-4">
                        {project.metrics.filter(metric => metric.label !== 'Category' && metric.label !== 'Industry' && metric.label !== 'Publication').slice(0, 3).map((metric, idx) => (
                          <div key={idx} className="flex items-center gap-1">
                            <span className={cn(
                              "text-sm font-bold",
                              project.category === 'content' 
                                ? "text-blue-600 dark:text-blue-400" 
                                : "text-purple-600 dark:text-purple-400"
                            )}>
                              {metric.value}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-500">
                              {metric.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.a>
                );
              }

              
              return (
                <motion.a
                  key={`mobile-simple-${project.id}`}
                  href={project.link}
                  target={project.category === 'journalism' ? "_blank" : "_self"}
                  rel={project.category === 'journalism' ? "noopener noreferrer" : undefined}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md dark:hover:shadow-gray-900/20 transition-all duration-200 group"
                >
                  {/* Simple Article Content */}
                  <div className="p-3">
                    <div className="flex items-center gap-2">
                      {/* Left: Content */}
                      <div className="flex-1 min-w-0">
                        {/* Title Only */}
                        <h3 className=" font-semibold text-gray-900 dark:text-gray-100 leading-tight line-clamp-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 text-sm">
                          {project.title}
                        </h3>
                      </div>

                      {/* Right: Article Thumbnail - Better Centered */}
                      <div className="flex-shrink-0 w-24 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
                        {project.image && project.image !== '/api/placeholder/400/300' ? (
                          <img 
                            src={project.image} 
                            alt={project.title}
                            className="w-full h-full object-cover object-center"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 dark:from-blue-500/30 dark:to-purple-500/30 flex items-center justify-center">
                            <HiNewspaper className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.a>
              );
            })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Show All Articles Button */}
        {filteredProjects.length > getDisplayProjects().length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <motion.button
              onClick={() => router.push('/articles')}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300"
            >
              <span>Show All Articles</span>
              <HiArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default WorkSection; 