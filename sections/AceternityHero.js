"use client";

import { motion } from 'framer-motion';
import { HiDownload, HiEye, HiSparkles } from 'react-icons/hi';
import * as PhosphorIcons from '@phosphor-icons/react';
import { cn } from '../utils/cn';
import Image from 'next/image';
import { useState, useEffect, useLayoutEffect } from 'react';

const AceternityHero = ({ profile, contactInfo = [] }) => {
  const socialLinks = contactInfo
    .filter(
      (c) =>
        c.type === 'social' ||
        c.label?.toLowerCase() === 'linkedin' ||
        c.label?.toLowerCase() === 'muckrack'
    )
    .filter((item, index, arr) => {
      const itemKey = item.id ?? `${item.type}-${item.label}-${item.href}`;
      return (
        index ===
        arr.findIndex((candidate) => {
          const candidateKey = candidate.id ?? `${candidate.type}-${candidate.label}-${candidate.href}`;
          return candidateKey === itemKey;
        })
      );
    });
  const targetCount = profile?.articleCount || 2434;
  const [displayCount, setDisplayCount] = useState(targetCount);

  // Set initial animation value before browser paint to avoid a flash
  useLayoutEffect(() => {
    setDisplayCount(Math.max(0, targetCount - 100));
  }, [targetCount]);

  // Animate article counter
  useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 2000;
      const startValue = Math.max(0, targetCount - 100);
      const endValue = targetCount;
      const startTime = Date.now();
      
      const animateCount = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutCubic);
        
        setDisplayCount(currentValue);
        
        if (progress < 1) {
          requestAnimationFrame(animateCount);
        }
      };
      
      animateCount();
    }, 900); 
    
    return () => clearTimeout(timer);
  }, [targetCount]);

  const handleDownloadResume = () => {
    const resumePath = profile?.resumePath;
    const link = document.createElement('a');
    link.href = resumePath;
    link.download = resumePath.split('/').pop();
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

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-neutral-bg dark:bg-neutral-bg-dark font-sans transition-colors duration-500 pt-16 sm:pt-20 lg:pt-16 pb-16 sm:pb-20 lg:pb-16"
    >
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
            className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-lg bg-card-bg dark:bg-card-bg-dark backdrop-blur-sm border border-card-border dark:border-white/20 shadow-lg mt-8"
          >
            <HiSparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
            <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 font-sans">
              {profile?.heroBadge || 'Dedicated Entertainment Journalist'}
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
                      <div className="w-full h-full bg-neutral-bg dark:bg-neutral-bg-dark rounded-full p-2">
                    <Image
                      src={profile?.profileImage || '/Urmi.webp'}
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
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 dark:from-yellow-500 dark:to-yellow-600 px-2 py-1 sm:px-4 sm:py-2 lg:px-4 lg:py-2 rounded-full shadow-xl border border-neutral-bg dark:border-neutral-bg-dark">
                  <span className="text-xs sm:text-sm lg:text-base font-bold text-gray-900 dark:text-gray-900 whitespace-nowrap">
                    {displayCount}+ Articles
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
              {profile?.heroTitle || "Hi, I'm Urmi Chakraborty"}
            </span>
          </motion.h1>

          {/* Subtitle*/}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mx-auto max-w-4xl leading-relaxed font-sans px-2 sm:px-4"
          >
            {profile?.heroSubtitle || (
              <>
                I am an{' '}
                <span className="font-semibold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  entertainment and lifestyle journalist
                </span>{' '}
                covering film, television, anime and people-centric stories.
              </>
            )}
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed font-sans px-2 sm:px-4"
          >
            {profile?.heroDescription || 'With over two years of experience in reporting and editorial work, I track trends across the film and pop culture landscape while also uncovering compelling city stories that connect with diverse audiences. I specialise in SEO-optimised articles and long-form features with a strong understanding of social media trends and editorial standards.'}
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
              "bg-card-bg dark:bg-card-bg-dark backdrop-blur-sm text-gray-700 dark:text-gray-300 border border-card-border dark:border-white/20",
              "hover:bg-neutral-bg dark:hover:bg-neutral-bg-dark hover:border-purple-300 dark:hover:border-purple-400 hover:text-purple-600 dark:hover:text-purple-400",
                "shadow-lg hover:shadow-xl transition-all duration-150 font-sans",
                "transform-gpu"
              )}
            >
              <HiEye className="w-5 h-5 group-hover:scale-110 transition-transform duration-150" />
              <span><span className='hidden sm:inline'>View</span>{" "}Portfolio</span>
            </motion.button>
          </motion.div>

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.8 }}
              className="flex flex-wrap justify-center gap-3 pt-2"
            >
              {socialLinks.map((link, index) => {
                const IconComponent = PhosphorIcons[link.icon] || PhosphorIcons.Globe;
                return (
                  <motion.a
                    key={link.id}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2 + index * 0.1, duration: 0.4 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card-bg dark:bg-card-bg-dark border border-card-border dark:border-white/20 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:border-purple-300 dark:hover:border-purple-400 shadow-md transition-colors"
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="text-sm font-medium">{link.label}</span>
                  </motion.a>
                );
              })}
            </motion.div>
          )}
        </motion.div>
      </div>

    </section>
  );
};

export default AceternityHero; 
