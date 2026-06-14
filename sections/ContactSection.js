"use client";

import { motion } from 'framer-motion';
import { HiExternalLink, HiDownload, HiSparkles } from 'react-icons/hi';
import * as PhosphorIcons from '@phosphor-icons/react';
import { cn } from '../utils/cn';

const ContactSection = ({ contactInfo = [], resources = [] }) => {
  const emailContact = contactInfo.find(c => c.type === 'email');
  const locationContact = contactInfo.find(c => c.type === 'location');
  const socialLinks = contactInfo
    .filter(c =>
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
  const actionLinks = contactInfo.filter(c => c.type === 'action');

  const emailAddress = emailContact?.value || 'urmi24112001@gmail.com';

  const sendEmail = () => {
    window.location.href = `mailto:${emailAddress}?subject=Hello Urmi&body=Hi Urmi,%0D%0A%0D%0AI would like to discuss...`;
  };

  const sendEmailWithProject = () => {
    window.location.href = `mailto:${emailAddress}?subject=Project Inquiry&body=Hi Urmi,%0D%0A%0D%0AI have a project opportunity and would like to discuss:%0D%0A%0D%0AProject Type:%0D%0ABudget:%0D%0ATimeline:%0D%0ADescription:%0D%0A%0D%0ABest regards`;
  };

  const sendEmailWithCollaboration = () => {
    window.location.href = `mailto:${emailAddress}?subject=Collaboration Opportunity&body=Hi Urmi,%0D%0A%0D%0AI would like to explore a collaboration opportunity:%0D%0A%0D%0AType of collaboration:%0D%0AYour expertise needed:%0D%0AProject details:%0D%0A%0D%0ALooking forward to hearing from you!`;
  };

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
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.section
      id="contact"
      className="relative py-16 md:py-20 bg-neutral-bg dark:bg-neutral-bg-dark font-sans transition-colors duration-500 overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-8 sm:mb-12 md:mb-16"
          variants={itemVariants}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-full bg-gradient-to-r from-purple-600/90 to-pink-600/90 dark:from-purple-500/90 dark:to-pink-500/90 text-white shadow-lg mb-4 sm:mb-6"
          >
            <HiSparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm font-medium font-sans">
              Get In Touch
            </span>
          </motion.div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 leading-tight font-sans px-4">
            Let&apos;s{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400 bg-clip-text text-transparent">
                connect
              </span>
              <motion.div
                className="absolute -bottom-1 sm:-bottom-2 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                viewport={{ once: true }}
              />
            </span>
            {' '}&{' '}
            <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 dark:from-pink-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
              create impactful
            </span>
            <br className="hidden sm:block" />
            <span className="block sm:inline"> content</span>
          </h2>
          
          <div className="max-w-5xl mx-auto px-4">
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-2 sm:mb-4">
              From breaking news to in-depth features, I bring clarity, creativity and credibility to every story.
            </p>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed">
              <span className="font-semibold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Let&apos;s collaborate and bring your vision to life.
              </span>
            </p>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 lg:items-start">
          
          {/* Left Column - Email Actions */}
          <motion.div 
            className="lg:col-span-2 space-y-8 flex flex-col h-full"
            variants={itemVariants}
          >
            {/* Primary Email CTA */}
            <div className="bg-card-bg dark:bg-card-bg-dark backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg border border-card-border dark:border-white/20">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 font-sans mb-2 lg:mb-0">
                  Ready to start a conversation?
                </h3>
                <div className="hidden lg:flex items-center gap-2 text-green-600 dark:text-green-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Usually respond in 24 hours</span>
                </div>
              </div>
              
              <motion.button
                onClick={sendEmail}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full group relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white p-4 sm:p-6 rounded-xl shadow-lg transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative text-center">
                  <div className="font-bold text-lg sm:text-xl">Send Email</div>
                  <div className="text-white/90 text-xs sm:text-sm">Start a conversation about your project</div>
                </div>
              </motion.button>
            </div>

            {/* Contact Information */}
            <div className="bg-card-bg dark:bg-card-bg-dark backdrop-blur-sm p-6 rounded-xl border border-card-border dark:border-white/20 flex-grow">
              <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-6 text-lg">Contact Information</h4>
              <div className="space-y-6">
                {contactInfo.length === 0 && (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No contact information added yet.</p>
                )}
                {contactInfo.filter(c => c.type !== 'social' && c.type !== 'action').map((item, index) => {
                  const IconComponent = PhosphorIcons[item.icon] || PhosphorIcons.Question;
                  return (
                    <motion.div
                      key={item.id}
                      className="flex items-center gap-4"
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="w-12 h-12 bg-card-bg dark:bg-card-bg-dark rounded-xl flex items-center justify-center border border-card-border dark:border-white/20">
                        <IconComponent className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{item.label}</p>
                        {item.href ? (
                          <a href={item.href} className="font-bold text-gray-900 dark:text-gray-100 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                            {item.value}
                          </a>
                        ) : (
                          <p className="font-bold text-gray-900 dark:text-gray-100">{item.value}</p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              
              {/* Additional Info to Balance Height */}
              <div className="mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Open to full-time opportunities</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mt-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Ready to relocate</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mt-2">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <span>Experienced in entertainment journalism</span>
                </div>
              </div>
            </div>
          </motion.div>
    
          <motion.div 
            className="space-y-8 flex flex-col h-full"
            variants={itemVariants}
          >
            {/* Downloads */}
            <div className="bg-card-bg dark:bg-card-bg-dark backdrop-blur-sm p-6 rounded-xl border border-card-border dark:border-white/20">
              <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-6 text-lg">Resources</h4>
              <div className="space-y-4">
                {resources.length === 0 && (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No resources added yet.</p>
                )}
                {resources.filter((resource) => resource.filePath).map((resource) => {
                  const handleDownload = () => {
                    const link = document.createElement('a');
                    link.href = resource.filePath;
                    link.download = resource.filePath.split('/').pop();
                    link.target = '_blank';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  };
                  const labelMap = {
                    'cv': 'CV',
                    'portfolio-pdf': 'Portfolio (PDF)',
                    'portfolio-docx': 'Portfolio (DOCX)',
                  };
                  const title = labelMap[resource.title?.toLowerCase()] || resource.title;
                  return (
                    <motion.button
                      key={resource.id}
                      onClick={handleDownload}
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full group bg-card-bg dark:bg-card-bg-dark hover:shadow-md transition-all duration-300 p-4 rounded-lg text-left border border-card-border dark:border-white/20"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                            <HiDownload className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h5 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors text-sm">
                              {title}
                            </h5>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {resource.description}
                            </p>
                          </div>
                        </div>
                        <HiDownload className="w-4 h-4 text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-card-bg dark:bg-card-bg-dark backdrop-blur-sm p-6 rounded-xl border border-card-border dark:border-white/20">
              <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-6 text-lg">Connect</h4>
              <div className="space-y-4">
                {socialLinks.length === 0 && (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No social links added yet.</p>
                )}
                {socialLinks.map((link, index) => {
                  const IconComponent = PhosphorIcons[link.icon] || PhosphorIcons.Globe;
                  return (
                    <motion.a
                      key={link.id}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-3 group p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-all duration-200"
                    >
                      <div className="w-10 h-10 bg-card-bg dark:bg-card-bg-dark rounded-lg flex items-center justify-center border border-card-border dark:border-white/20">
                        <IconComponent className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm">
                          {link.label}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {link.value}
                        </p>
                      </div>
                      <HiExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default ContactSection; 
