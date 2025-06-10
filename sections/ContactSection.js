"use client";

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { HiMail, HiPhone, HiLocationMarker, HiExternalLink, HiPaperAirplane, HiUser, HiChatAlt, HiDownload, HiChat, HiSparkles } from 'react-icons/hi';
import { cn } from '../utils/cn';

const ContactSection = ({ preloaded = false }) => {
  const contactInfo = [
    {
      icon: HiMail,
      label: 'Email',
      value: 'urmi24112001@gmail.com',
      href: 'mailto:urmi24112001@gmail.com'
    },
    {
      icon: HiLocationMarker,
      label: 'Location',
      value: 'Kolkata, India',
      href: null
    }
  ];

  const socialLinks = [
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/in/urmi-chakraborty-809678183/',
      description: 'Professional network & updates',
      icon: '👔'
    },
    {
      name: 'Muckrack',
      href: 'https://muckrack.com/urmi-chakraborty-1',
      description: 'My Muck Rack profile',
      icon: '📰'
    }
  ];

  const downloadPortfolioPDF = () => {
    const link = document.createElement('a');
    link.href = '/Urmi_Chakraborty_Portfolio_Content_Writing_Samples.pdf';
    link.download = 'Urmi_Chakraborty_Portfolio_Content_Writing_Samples.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPortfolioDOCX = () => {
    const link = document.createElement('a');
    link.href = '/Urmi_Chakraborty_Portfolio_Content_Writing_Samples.docx';
    link.download = 'Urmi_Chakraborty_Portfolio_Content_Writing_Samples.docx';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadCV = () => {
    const link = document.createElement('a');
    link.href = '/Urmi_Chakraborty_CV.pdf';
    link.download = 'Urmi_Chakraborty_CV.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const quickActions = [
    {
      title: 'Download CV',
      description: 'Get my complete resume and professional background',
      action: 'Download PDF',
      icon: HiUser,
      onClick: downloadCV,
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      title: 'Download Portfolio (PDF)',
      description: 'View my content writing samples and case studies',
      action: 'Download PDF',
      icon: HiDownload,
      onClick: downloadPortfolioPDF,
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Download Portfolio (DOCX)',
      description: 'Editable version of my writing samples',
      action: 'Download DOCX',
      icon: HiDownload,
      onClick: downloadPortfolioDOCX,
      gradient: 'from-pink-500 to-blue-500'
    }
  ];

  // Email action functions
  const sendEmail = () => {
    window.location.href = 'mailto:urmi24112001@gmail.com?subject=Hello Urmi&body=Hi Urmi,%0D%0A%0D%0AI would like to discuss...';
  };

  const sendEmailWithProject = () => {
    window.location.href = 'mailto:urmi24112001@gmail.com?subject=Project Inquiry&body=Hi Urmi,%0D%0A%0D%0AI have a project opportunity and would like to discuss:%0D%0A%0D%0AProject Type:%0D%0ABudget:%0D%0ATimeline:%0D%0ADescription:%0D%0A%0D%0ABest regards';
  };

  const sendEmailWithCollaboration = () => {
    window.location.href = 'mailto:urmi24112001@gmail.com?subject=Collaboration Opportunity&body=Hi Urmi,%0D%0A%0D%0AI would like to explore a collaboration opportunity:%0D%0A%0D%0AType of collaboration:%0D%0AYour expertise needed:%0D%0AProject details:%0D%0A%0D%0ALooking forward to hearing from you!';
  };

  // Optimized animation variants for better performance
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

  // Loading state component
  if (!preloaded) {
    return (
      <section id="contact" className="relative py-16 md:py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 font-sans transition-colors duration-500 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mx-auto"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <motion.section 
      id="contact" 
      className="relative py-16 md:py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 font-sans transition-colors duration-500 overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate={preloaded ? "visible" : "hidden"}
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="absolute inset-0 bg-grid-slate-100/50 dark:bg-grid-slate-700/20 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-300 to-pink-300 dark:from-purple-500/30 dark:to-pink-500/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 dark:opacity-10 animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-300 to-cyan-300 dark:from-blue-500/30 dark:to-cyan-500/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 dark:opacity-10 animate-pulse-slower" />
      </div>
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
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg border border-white/50 dark:border-gray-700/50">
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
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-white/50 dark:border-gray-700/50 flex-grow">
              <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-6 text-lg">Contact Information</h4>
              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-4"
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-slate-100 to-blue-100 dark:from-slate-800 dark:to-blue-900/50 rounded-xl flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-slate-600 dark:text-slate-400" />
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
                ))}
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
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-white/50 dark:border-gray-700/50">
              <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-6 text-lg">Resources</h4>
              <div className="space-y-4">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={index}
                    onClick={action.onClick}
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full group bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/30 hover:shadow-md transition-all duration-300 p-4 rounded-lg text-left border border-slate-200/50 dark:border-slate-700/50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 bg-gradient-to-r ${action.gradient} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <action.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors text-sm">
                            {action.title}
                          </h5>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {action.description}
                          </p>
                        </div>
                      </div>
                      <HiDownload className="w-4 h-4 text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-white/50 dark:border-gray-700/50">
              <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-6 text-lg">Connect</h4>
              <div className="space-y-4">
                {socialLinks.map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-3 group p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-all duration-200"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg flex items-center justify-center">
                      <span className="text-lg">{link.icon}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm">
                        {link.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {link.description}
                      </p>
                    </div>
                    <HiExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                  </motion.a>
                ))}
              </div>
            </div>


          </motion.div>
        </div>
      </div>

      {/* Custom Styles */}
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

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
        
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.3; }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
        
        .animate-pulse-slower {
          animation: pulse-slower 12s ease-in-out infinite;
        }
      `}</style>
    </motion.section>
  );
};

export default ContactSection; 