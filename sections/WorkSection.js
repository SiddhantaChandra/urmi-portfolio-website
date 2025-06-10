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

    // Set initial value
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
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

  // Create alternating pattern for all articles
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

  // Limit articles based on screen size
  const getDisplayProjects = () => {
    const limit = isMobile ? 4 : 9;
    return filteredProjects.slice(0, limit);
  };

  return (
    <section id="work" className="py-20 bg-white dark:bg-gray-900 font-sans transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <span className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium mb-4">
            Portfolio
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6 font-sans">
            My Work &
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent"> Impact</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed font-sans">
            From covering developments in the entertainment and city beats to producing content across several niches, here's a showcase of my diverse writing portfolio.
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex justify-center mb-8 sm:mb-12"
        >
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1 inline-flex">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "flex items-center gap-2 px-3 py-3 rounded-md text-xs sm:text-sm font-medium transition-all duration-150",
                    activeTab === tab.id
                      ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  )}
                >
                  <IconComponent className="w-4 h-4" />
                  {tab.label}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {getDisplayProjects().map((project, index) => (
              <motion.a
                key={project.id}
                href={project.link}
                target={project.category === 'journalism' ? "_blank" : "_self"}
                rel={project.category === 'journalism' ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
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