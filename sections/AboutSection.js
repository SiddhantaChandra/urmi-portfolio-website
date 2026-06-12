"use client";

import { motion } from 'framer-motion';
import * as PhosphorIcons from '@phosphor-icons/react';
import Image from 'next/image';

const AboutSection = ({ skills = [], differentiators = [], brands = [] }) => {
  return (
    <section id="about" className="pt-16 md:pt-20 bg-neutral-bg dark:bg-neutral-bg-dark font-sans transition-colors duration-500">
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
            <div className="bg-card-bg dark:bg-card-bg-dark backdrop-blur-sm rounded-lg p-5 md:p-8 shadow-lg border border-card-border dark:border-white/20 h-full flex flex-col">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 md:mb-6 font-sans">Core Skills</h3>
              <div className="flex flex-col justify-between flex-1">
                {skills.length === 0 && (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No skills added yet.</p>
                )}
                {skills.map((skill, index) => {
                  const IconComponent = PhosphorIcons[skill.icon] || PhosphorIcons.Question;
                  return (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-9 h-9 md:w-11 md:h-11 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 rounded-lg flex items-center justify-center">
                          <IconComponent weight="bold" className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        </div>
                        <span className="text-base md:text-lg font-medium text-gray-900 dark:text-gray-100 font-sans">{skill.name}</span>
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
            <div className="bg-card-bg dark:bg-card-bg-dark backdrop-blur-sm rounded-lg p-5 md:p-8 shadow-lg border border-card-border dark:border-white/20 h-full">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 md:mb-6 font-sans">What Sets Me Apart</h3>
              <div className="space-y-3 md:space-y-4">
                {differentiators.length === 0 && (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No differentiators added yet.</p>
                )}
                {differentiators.map((diff, index) => (
                  <motion.div
                    key={diff.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-2 md:gap-3"
                  >
                    <div className="w-5 h-5 md:w-6 md:h-6 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed font-sans">
                      <strong className="text-gray-900 dark:text-gray-100">{diff.title}:</strong> {diff.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

    
      <div className="relative -mx-3 sm:-mx-6 lg:-mx-8 overflow-hidden">
        <div className="absolute inset-0 bg-card-bg dark:bg-card-bg-dark"></div>
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
              {brands.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-sm">No brands added yet.</p>
              )}
              {brands.map((brand, index) => (
                <motion.div
                  key={brand.id}
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
                      className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 rounded-md"
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
                  key={brand.id}
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
                      className="max-w-full max-h-full object-contain transition-all duration-300 rounded-md"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* 5th brand centered */}
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
                      className="max-w-full max-h-full object-contain transition-all duration-300 rounded-md"
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
