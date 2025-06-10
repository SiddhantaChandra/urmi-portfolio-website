"use client";

import { motion } from 'framer-motion';
import { HiDownload, HiEye, HiMail, HiSparkles } from 'react-icons/hi';
import { cn } from '../utils/cn';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const AceternityHero = () => {
  const [articleCount, setArticleCount] = useState(2250);

  // Animate article counter
  useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 2000;
      const startValue = 2250;
      const endValue = 2276;
      const startTime = Date.now();
      
      const animateCount = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutCubic);
        
        setArticleCount(currentValue);
        
        if (progress < 1) {
          requestAnimationFrame(animateCount);
        }
      };
      
      animateCount();
    }, 800); // Start after 800ms delay
    
    return () => clearTimeout(timer);
  }, []);

  const handleDownloadResume = () => {
    const link = document.createElement('a');
    link.href = '/Urmi_Chakraborty_CV.pdf';
    link.download = 'Urmi_Chakraborty_CV.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewCaseStudies = () => {
    const element = document.querySelector('#work');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 font-sans transition-colors duration-500 pt-16 sm:pt-20 lg:pt-16 pb-16 sm:pb-20 lg:pb-16"
    >
      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-grid-slate-100/50 dark:bg-grid-slate-700/20 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] pointer-events-none" />
      
      {/* Spotlight Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-300 to-pink-300 dark:from-purple-500/30 dark:to-pink-500/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 dark:opacity-10 animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-300 to-cyan-300 dark:from-blue-500/30 dark:to-cyan-500/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 dark:opacity-10 animate-pulse-slower" />
      </div>

      {/* Floating Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.6, 0],
              scale: [0, 1, 0],
              x: [0, Math.random() * 80 - 40],
              y: [0, Math.random() * 80 - 40],
            }}
            transition={{
              duration: 12 + i * 2,
              repeat: Infinity,
              delay: i * 2,
              ease: "easeInOut",
            }}
            className={cn(
              "absolute rounded-lg bg-gradient-to-r from-purple-400 to-pink-400 dark:from-purple-500 dark:to-pink-500 opacity-10 dark:opacity-5",
              i % 2 === 0 ? "w-4 h-4" : "w-6 h-6"
            )}
            style={{
              left: `${10 + (i * 15)}%`,
              top: `${20 + (i * 10)}%`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 sm:space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-200/50 dark:border-purple-500/30 shadow-lg"
          >
            <HiSparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
            <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 font-sans">
            Dedicated Entertainment Journalist
            </span>
          </motion.div>

          {/* Circular Profile Picture with Article Counter */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative mx-auto w-fit"
          >
            <div className="relative">
              {/* Profile Image with Border */}
              <div className="relative w-36 h-36 sm:w-48 sm:h-48 lg:w-56 lg:h-56 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400 rounded-full p-1 shadow-2xl">
                  <div className="w-full h-full bg-white dark:bg-gray-800 rounded-full p-2">
                    <Image
                      src="/Urmi.jpg"
                      alt="Urmi Chakraborty"
                      width={256}
                      height={256}
                      className="w-full h-full object-cover rounded-full"
                      priority
                    />
                  </div>
                </div>
              </div>
              
              {/* Article Counter Tag */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 lg:-bottom-3 lg:-right-4"
              >
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 dark:from-yellow-500 dark:to-yellow-600 px-2 py-1 sm:px-4 sm:py-2 lg:px-4 lg:py-2 rounded-full shadow-xl border-2 sm:border-4 border-white dark:border-gray-800">
                  <span className="text-xs sm:text-sm lg:text-base font-bold text-gray-900 dark:text-gray-900 whitespace-nowrap">
                    {articleCount}+ Articles
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight font-sans"
          >
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-100 dark:via-gray-200 dark:to-gray-100 bg-clip-text text-transparent">
              Hi, I'm{' '}
            </span>
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400 bg-clip-text text-transparent">
              Urmi Chakraborty
            </span>
          </motion.h1>

          {/* Subtitle*/}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mx-auto max-w-4xl leading-relaxed font-sans px-2 sm:px-4"
          >
            I am passionate about{' '}
            <span className="font-semibold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              crafting compelling stories
            </span>{' '}
            that spark conversations and connect with a diverse audience.
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed font-sans px-2 sm:px-4"
          >
            From interviewing personalities to tracking pop culture trends across anime, Hollywood, and Bollywood, I bring nearly two years of experience in entertainment journalism and editorial work. My role at The Telegraph Online combines fast-paced reporting, content editing, and sharp communication, all driven by strong instincts for what resonates with readers.
          </motion.p>

          {/* Enhanced CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-2 sm:pt-4 px-4"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.15 }}
              onClick={handleDownloadResume}
              className={cn(
                "group relative inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold w-full sm:w-auto",
                "bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 text-white",
                "shadow-lg hover:shadow-xl transition-all duration-150 font-sans",
                "transform-gpu"
              )}
            >
              <HiDownload className="w-5 h-5 group-hover:animate-bounce transition-transform duration-150" />
              <span><span className='hidden sm:inline'>Download</span>{" "}Resume</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.15 }}
              onClick={handleViewCaseStudies}
              className={cn(
                "group inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold w-full sm:w-auto",
                "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-300 border-2 border-purple-200 dark:border-purple-500/30",
                "hover:bg-white dark:hover:bg-gray-700 hover:border-purple-300 dark:hover:border-purple-400 hover:text-purple-600 dark:hover:text-purple-400",
                "shadow-lg hover:shadow-xl transition-all duration-150 font-sans",
                "transform-gpu"
              )}
            >
              <HiEye className="w-5 h-5 group-hover:scale-110 transition-transform duration-150" />
              <span><span className='hidden sm:inline'>View</span>{" "}Portfolio</span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

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
    </section>
  );
};

export default AceternityHero; 