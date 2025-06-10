"use client";

import { motion } from 'framer-motion';
import { HiPencilAlt, HiGlobe, HiTrendingUp, HiUsers, HiStar, HiBookOpen } from 'react-icons/hi';
import { cn } from '../utils/cn';
import Image from 'next/image';

const AboutSection = () => {
  const skills = [
    { name: 'SEO Writing', icon: HiGlobe, level: 98 },
    { name: 'Editing & Proofreading', icon: HiPencilAlt, level: 98 },
    { name: 'Interviewing Techniques', icon: HiTrendingUp, level: 95 },
    { name: 'WordPress/CMS', icon: HiBookOpen, level: 91 },
    { name: 'Social Media Content', icon: HiStar, level: 88 }
  ];

  const brands = [
    { name: 'The Telegraph Online', logo: '/brands/The_Telegraph_Online.svg', alt: 'The Telegraph Online' },
    { name: 'ABP Digital', logo: '/brands/abp_digital.jpg', alt: 'ABP Digital' },
    { name: 'MyKolkata', logo: '/brands/mykolkata-new.svg', alt: 'MyKolkata' },
    { name: 'AllCap Communications', logo: '/brands/allcap-communications.svg', alt: 'AllCap Communications' },
    { name: 'My Chat Lesson', logo: '/brands/my-chat-lesson-logo.png', alt: 'My Chat Lesson' },
  ];

  return (
    <section id="about" className="pt-16 md:pt-20 bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-800 dark:to-gray-900/50 font-sans transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="inline-block px-3 py-1.5 md:px-4 md:py-2 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-lg text-xs md:text-sm font-medium mb-3 md:mb-4">
            About Me
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 md:mb-6 font-sans leading-tight">
            From Newsrooms to 
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">{" "}Compelling Content</span>
          </h2>
          
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-stretch mb-16 md:mb-20">
          {/* Left Column - Skills */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6 md:space-y-8 h-full"
          >
            {/* Skills */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-5 md:p-8 shadow-lg border border-white/50 dark:border-gray-700/50 h-full">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 md:mb-6 font-sans">Core Skills</h3>
              <div className="space-y-4 md:space-y-6">
                {skills.map((skill, index) => {
                  const IconComponent = skill.icon;
                  return (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="space-y-2 md:space-y-3"
                    >
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-3 h-3 md:w-4 md:h-4 text-white" />
                        </div>
                        <span className="text-base md:text-lg font-medium text-gray-900 dark:text-gray-100 font-sans">{skill.name}</span>
                        <span className="ml-auto text-xs md:text-sm text-gray-500 dark:text-gray-400 font-sans">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          viewport={{ once: true }}
                          className="h-2 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 rounded-full"
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Right Column - What Sets Me Apart */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="space-y-6 md:space-y-8 h-full"
          >
            {/* What Sets Me Apart */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-5 md:p-8 shadow-lg border border-white/50 dark:border-gray-700/50 h-full">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 md:mb-6 font-sans">What Sets Me Apart</h3>
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-start gap-2 md:gap-3">
                  <div className="w-5 h-5 md:w-6 md:h-6 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed font-sans">
                    <strong className="text-gray-900 dark:text-gray-100">Audience Understanding:</strong> Capture attention and maintain engagement
                  </p>
                </div>
                <div className="flex items-start gap-2 md:gap-3">
                  <div className="w-5 h-5 md:w-6 md:h-6 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed font-sans">
                    <strong className="text-gray-900 dark:text-gray-100">SEO-driven Approach:</strong> Boost page views using Google trends research
                  </p>
                </div>
                <div className="flex items-start gap-2 md:gap-3">
                  <div className="w-5 h-5 md:w-6 md:h-6 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed font-sans">
                    <strong className="text-gray-900 dark:text-gray-100">Cross-industry Storytelling:</strong> Write for audiences ranging from entertainment to city and culture
                  </p>
                </div>
                <div className="flex items-start gap-2 md:gap-3">
                  <div className="w-5 h-5 md:w-6 md:h-6 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed font-sans">
                    <strong className="text-gray-900 dark:text-gray-100">Meeting Deadlines:</strong> Deliver daily news while maintaining editorial standards
                  </p>
                </div>
                <div className="flex items-start gap-2 md:gap-3">
                  <div className="w-5 h-5 md:w-6 md:h-6 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed font-sans">
                    <strong className="text-gray-900 dark:text-gray-100">Interviewing Techniques:</strong> Source and interview multiple subjects effectively under pressure
                  </p>
                </div>
                <div className="flex items-start gap-2 md:gap-3">
                  <div className="w-5 h-5 md:w-6 md:h-6 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed font-sans">
                    <strong className="text-gray-900 dark:text-gray-100">Boosting Visibility:</strong> Use push notifications to increase page views
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Integrated Brands Section - Full Width with Subtle Background */}
      <div className="relative -mx-3 sm:-mx-6 lg:-mx-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100/50 to-blue-100/30 dark:from-gray-700/30 dark:to-gray-800/30"></div>
        <div className="relative py-12 md:py-16 px-3 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-12"
          >
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 md:mb-8 font-sans leading-tight">
              Trusted by Leading 
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent"> Brands</span>
            </h3>
          </motion.div>

          {/* Desktop - Static Grid */}
          <div className="hidden md:block">
            <div className="flex items-center justify-center gap-16 lg:gap-24">
              {brands.map((brand, index) => (
                <motion.div
                  key={brand.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group flex-shrink-0"
                >
                  <div className="relative w-32 h-32 lg:w-40 lg:h-40 flex items-center justify-center transition-all duration-300 transform group-hover:scale-110">
                    <Image
                      src={brand.logo}
                      alt={brand.alt}
                      width={160}
                      height={160}
                      className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile - Grid Layout */}
          <div className="md:hidden">
            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
              {/* First 4 brands in 2x2 grid */}
              {brands.slice(0, 4).map((brand, index) => (
                <motion.div
                  key={brand.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group flex items-center justify-center"
                >
                  <div className="relative w-28 h-20 flex items-center justify-center transition-all duration-300 transform group-hover:scale-105">
                    <Image
                      src={brand.logo}
                      alt={brand.alt}
                      width={112}
                      height={112}
                      className="max-w-full max-h-full object-contain transition-all duration-300"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* 5th brand centered below */}
            {brands[4] && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                className="flex justify-center mt-4"
              >
                <div className="group flex items-center justify-center">
                  <div className="relative w-28 h-20 flex items-center justify-center transition-all duration-300 transform group-hover:scale-105">
                    <Image
                      src={brands[4].logo}
                      alt={brands[4].alt}
                      width={112}
                      height={112}
                      className="max-w-full max-h-full object-contain transition-all duration-300"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection; 