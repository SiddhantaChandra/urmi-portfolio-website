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
    { name: 'Brand Storytelling', icon: HiUsers, level: 92 },
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
    <section id="about" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-800 dark:to-gray-900/50 font-sans transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-medium mb-4">
            About Me
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6 font-sans">
            From Newsrooms to 
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent"> Brand Stories</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed font-sans">
            A journalist's precision meets content marketing strategy. I bring editorial excellence 
            to brand storytelling, turning complex ideas into compelling narratives that convert.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start mb-20">
          {/* Left Column - Skills */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Skills */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-8 shadow-lg border border-white/50 dark:border-gray-700/50">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 font-sans">Core Skills</h3>
              <div className="space-y-6">
                {skills.map((skill, index) => {
                  const IconComponent = skill.icon;
                  return (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="space-y-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-lg font-medium text-gray-900 dark:text-gray-100 font-sans">{skill.name}</span>
                        <span className="ml-auto text-sm text-gray-500 dark:text-gray-400 font-sans">{skill.level}%</span>
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
            className="space-y-8"
          >
            {/* What Sets Me Apart */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-8 shadow-lg border border-white/50 dark:border-gray-700/50">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 font-sans">What Sets Me Apart</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-sans">
                    <strong className="text-gray-900 dark:text-gray-100">Audience Understanding:</strong> Capture attention and maintain engagement
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-sans">
                    <strong className="text-gray-900 dark:text-gray-100">SEO-driven Approach:</strong> Boost page views using Google trends research
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-sans">
                    <strong className="text-gray-900 dark:text-gray-100">Cross-industry Storytelling:</strong> Write for audiences ranging from entertainment to city and culture
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-sans">
                    <strong className="text-gray-900 dark:text-gray-100">Meeting Deadlines:</strong> Deliver daily news while maintaining editorial standards
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-sans">
                    <strong className="text-gray-900 dark:text-gray-100">Interviewing Techniques:</strong> Source and interview multiple subjects effectively under pressure
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-sans">
                    <strong className="text-gray-900 dark:text-gray-100">Boosting Visibility:</strong> Use push notifications to increase page views
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Integrated Brands Section - Full Width with Subtle Background */}
      <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100/50 to-blue-100/30 dark:from-gray-700/30 dark:to-gray-800/30"></div>
        <div className="relative py-16 px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 font-sans">
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

          {/* Mobile - Ticker Animation */}
          <div className="md:hidden">
            <style jsx>{`
              @keyframes scroll {
                0% { transform: translateX(100%); }
                100% { transform: translateX(-100%); }
              }
              .ticker {
                animation: scroll 20s linear infinite;
              }
              .ticker:hover {
                animation-play-state: paused;
              }
            `}</style>
            
            <div className="relative overflow-hidden">
              <div className="ticker flex items-center gap-12 py-4 whitespace-nowrap">
                {/* Duplicate brands for seamless loop */}
                {[...brands, ...brands, ...brands].map((brand, index) => (
                  <div
                    key={`${brand.name}-${index}`}
                    className="flex-shrink-0 group"
                  >
                    <div className="relative w-28 h-20 flex items-center justify-center transition-all duration-300">
                      <Image
                        src={brand.logo}
                        alt={brand.alt}
                        width={120}
                        height={120}
                        className="max-w-full max-h-full object-contain filter grayscale  group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection; 