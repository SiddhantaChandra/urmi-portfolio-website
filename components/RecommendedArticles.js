"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';
import { HiChevronLeft, HiChevronRight, HiEye, HiClock, HiArrowRight } from 'react-icons/hi';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import contentWritingArticles from './ContentWritingData';
import journalArticles from './JournalismData';

const RecommendedArticles = ({ currentArticleSlug, currentArticleId }) => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledArticles, setShuffledArticles] = useState([]);
  const [isInView, setIsInView] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const sectionRef = useRef(null);
  
  // Responsive items per view - Updated counts
  const [itemsPerView, setItemsPerView] = useState(4);
  
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(2); // Mobile: 2 cards
      } else if (window.innerWidth < 1024) {
        setItemsPerView(3); // Tablet: 3 cards
      } else {
        setItemsPerView(4); // Desktop: 4 cards
      }
    };
    
    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '200px 0px', // Start loading 200px before the section comes into view
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [isInView]);

  // Client-side shuffle to avoid hydration mismatch - only when in view
  useEffect(() => {
    if (!isInView) return;
    
    setIsLoading(true);
    
    // Simulate loading delay for better UX
    const timer = setTimeout(() => {
      // Get all articles and filter out current article
      const allArticles = [...contentWritingArticles, ...journalArticles];
      
      // Create a Set to track unique articles and avoid duplicates
      const seenTitles = new Set();
      const uniqueArticles = allArticles.filter(article => {
        // Skip current article
        if (article.slug === currentArticleSlug || article.id === currentArticleId) {
          return false;
        }
        
        // Skip duplicates based on title
        if (seenTitles.has(article.title)) {
          return false;
        }
        
        seenTitles.add(article.title);
        return true;
      });
      
      // Shuffle and prepare articles for display
      const shuffled = uniqueArticles
        .sort(() => Math.random() - 0.5)
        .slice(0, 8)
        .map((article, index) => ({
          ...article,
          uniqueKey: `${article.slug || article.id || article.title.replace(/\s+/g, '-').toLowerCase()}-${index}`,
          displayImage: article.featuredImage || article.image,
        }));
      
      setShuffledArticles(shuffled);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [isInView, currentArticleSlug, currentArticleId]);
  
  const goToNext = useCallback(() => {
    const maxIndex = shuffledArticles.length - itemsPerView;
    setCurrentIndex(prev => {
      const nextIndex = prev + itemsPerView;
      return nextIndex > maxIndex ? 0 : nextIndex;
    });
  }, [shuffledArticles.length, itemsPerView]);
  
  const goToPrev = useCallback(() => {
    const maxIndex = shuffledArticles.length - itemsPerView;
    setCurrentIndex(prev => {
      if (prev === 0) {
        // If at the beginning, go to the last complete set
        return Math.floor(maxIndex / itemsPerView) * itemsPerView;
      } else {
        // Otherwise, go back by itemsPerView
        const prevIndex = Math.max(0, prev - itemsPerView);
        return prevIndex;
      }
    });
  }, [shuffledArticles.length, itemsPerView]);
  
  const handleArticleClick = useCallback((article) => {
    // Handle different article types properly
    if (article.slug) {
      // Content writing articles with slugs
      router.push(`/articles/${article.slug}`);
    } else if (article.link) {
      // Journalism articles with external links
      window.open(article.link, '_blank');
    } else if (article.id) {
      // Legacy articles with IDs
      router.push(`/articles/${article.id}`);
    }
  }, [router]);

  // Touch handling for mobile swipe
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && shuffledArticles.length > itemsPerView) {
      goToNext();
    }
    if (isRightSwipe && shuffledArticles.length > itemsPerView) {
      goToPrev();
    }
  };
  
  // Don't render until in view
  if (!isInView) {
    return (
      <div 
        ref={sectionRef}
        className="py-16 bg-gradient-to-br from-gray-50 via-purple-50/20 to-blue-50/30 dark:from-gray-900 dark:via-purple-900/10 dark:to-gray-800/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-6 sm:h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-48 sm:w-64 mx-auto mb-4"></div>
              <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded w-72 sm:w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Loading state after intersection
  if (isLoading || shuffledArticles.length === 0) {
    return (
      <motion.section
        ref={sectionRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="py-12 sm:py-16 bg-gradient-to-br from-gray-50 via-purple-50/20 to-blue-50/30 dark:from-gray-900 dark:via-purple-900/10 dark:to-gray-800/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <div className="animate-pulse">
              <div className="h-6 sm:h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-48 sm:w-64 mx-auto mb-4"></div>
              <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded w-72 sm:w-96 mx-auto"></div>
            </div>
          </div>
          
          {/* Loading Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: itemsPerView }, (_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="h-32 sm:h-48 bg-gray-200 dark:bg-gray-700"></div>
                  <div className="p-4 sm:p-6 space-y-3">
                    <div className="h-4 sm:h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>
    );
  }
  
  const maxIndex = shuffledArticles.length - itemsPerView;
  const canNavigate = shuffledArticles.length > itemsPerView;
  
  // Calculate pagination dots based on itemsPerView (responsive)
  const totalPages = Math.ceil(shuffledArticles.length / itemsPerView);
  const currentPage = Math.floor(currentIndex / itemsPerView);
  
  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="py-12 sm:py-16 bg-gradient-to-br from-gray-50 via-purple-50/20 to-blue-50/30 dark:from-gray-900 dark:via-purple-900/10 dark:to-gray-800/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 text-purple-700 dark:text-purple-300 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4 border border-purple-200/50 dark:border-purple-700/50"
          >
            <HiArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            More Great Reads
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4"
          >
            You May Also{' '}
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400 bg-clip-text text-transparent">
              Like
            </span>
          </motion.h2>
          
        </div>
        
        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Arrows - Hidden on mobile, visible on larger screens */}
          {canNavigate && (
            <>
              <motion.button
                onClick={goToPrev}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 lg:w-12 lg:h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 items-center justify-center text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300 -ml-5 lg:-ml-6"
              >
                <HiChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
              </motion.button>
              
              <motion.button
                onClick={goToNext}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 lg:w-12 lg:h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 items-center justify-center text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300 -mr-5 lg:-mr-6"
              >
                <HiChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
              </motion.button>
            </>
          )}
          
          {/* Articles Carousel */}
          <div 
            className="overflow-hidden rounded-xl"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <motion.div
              className="flex"
              animate={{
                x: `-${currentIndex * (100 / itemsPerView)}%`
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
            >
              {shuffledArticles.map((article, index) => (
                <motion.div
                  key={article.uniqueKey}
                  className={`flex-none ${
                    itemsPerView === 2 ? 'w-1/2' : 
                    itemsPerView === 3 ? 'w-1/2 lg:w-1/3' : 
                    'w-1/2 lg:w-1/3 xl:w-1/4'
                  } px-2 sm:px-3`}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 cursor-pointer group h-full"
                    onClick={() => handleArticleClick(article)}
                    whileHover={{ 
                      y: -4,
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    {/* Article Image */}
                    <div className="relative h-32 sm:h-40 md:h-48 lg:h-56 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 overflow-hidden">
                      {article.displayImage ? (
                        <Image
                          src={article.displayImage}
                          alt={article.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <HiEye className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                          </div>
                        </div>
                      )}
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Category Badge */}
                      <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
                        <motion.span 
                          className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-white/90 dark:bg-gray-800/90 text-purple-600 dark:text-purple-400 text-xs font-medium rounded backdrop-blur-sm border border-white/20"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                        >
                          {article.category}
                        </motion.span>
                      </div>
                      
                      {/* Read More Indicator */}
                      <motion.div 
                        className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center shadow-lg">
                          <HiArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 dark:text-purple-400" />
                        </div>
                      </motion.div>
                    </div>
                    
                    {/* Article Content */}
                    <div className="p-3 sm:p-4 lg:p-6">
                      <motion.h3 
                        className="font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300 line-clamp-2 leading-tight text-sm sm:text-base"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        {article.title}
                      </motion.h3>
                      
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3 leading-relaxed">
                        {article.excerpt || article.subHeading}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
          
          {/* Mobile Navigation Buttons */}
          {canNavigate && (
            <div className="flex md:hidden justify-center mt-4 gap-4">
              <motion.button
                onClick={goToPrev}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300"
              >
                <HiChevronLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Prev</span>
              </motion.button>
              
              <motion.button
                onClick={goToNext}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300"
              >
                <span className="text-sm font-medium">Next</span>
                <HiChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          )}
          
          {/* Pagination Dots */}
          {canNavigate && (
            <div className="flex justify-center mt-6 sm:mt-8 gap-2">
              {Array.from({ length: totalPages }, (_, index) => (
                <motion.button
                  key={`pagination-${index}`}
                  onClick={() => setCurrentIndex(index * itemsPerView)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.8 }}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    index === currentPage
                      ? 'bg-purple-600 dark:bg-purple-400'
                      : 'bg-gray-300 dark:bg-gray-600 hover:bg-purple-400 dark:hover:bg-purple-500'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Swipe Instruction for Mobile */}
          {canNavigate && (
            <div className="md:hidden text-center mt-4">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Swipe left or right to browse articles
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
};

export default RecommendedArticles;