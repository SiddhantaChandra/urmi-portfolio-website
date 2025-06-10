"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { HiMail, HiLocationMarker, HiExternalLink, HiPhone, HiHeart, HiDownload, HiArrowUp } from 'react-icons/hi';
import { FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Show back to top button when user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
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

  const downloadPortfolio = () => {
    const link = document.createElement('a');
    link.href = '/Urmi_Chakraborty_Portfolio_Content_Writing_Samples.pdf';
    link.download = 'Urmi_Chakraborty_Portfolio_Content_Writing_Samples.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const navigationLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Experience', href: '#experience' },
    { name: 'Work', href: '#work' },
    { name: 'Contact', href: '#contact' }
  ];

  const services = [
    { name: 'Content Writing', href: '#work' },
    { name: 'Journalism', href: '#experience' },
    { name: 'SEO Writing', href: '#work' },
    { name: 'Editing & Proofreading', href: '#work' },
    { name: 'Editorial Services', href: '#experience' }
  ];

  const documents = [
    { name: 'Download CV', onClick: downloadCV },
    { name: 'Portfolio (PDF)', onClick: downloadPortfolio },
    { name: 'View Experience', href: '#experience' },
    { name: 'View Work Samples', href: '#work' }
  ];

  const socialLinks = [
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/in/urmi-chakraborty-809678183/',
      icon: FaLinkedin,
      color: 'hover:text-blue-600 dark:hover:text-blue-400'
    },
    {
      name: 'Muckrack',
      href: 'https://muckrack.com/urmi-chakraborty-1',
      icon: HiExternalLink,
      color: 'hover:text-green-600 dark:hover:text-green-400'
    }
  ];

  const contactInfo = [
    {
      icon: HiMail,
      text: 'urmi24112001@gmail.com',
      href: 'mailto:urmi24112001@gmail.com'
    },
    {
      icon: HiLocationMarker,
      text: 'Kolkata, India',
      href: null
    }
  ];

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-5 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Brand & Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              {/* Footer Logo */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-lg overflow-hidden shadow-md">
                  <Image 
                    src="/logo.webp" 
                    alt="Urmi Chakraborty Logo" 
                    className="w-full h-full object-cover"
                    width={40}
                    height={40}
                  />
                </div>
                <h3 className="text-2xl font-bold text-white font-sans">
                  Urmi Chakraborty
                </h3>
              </div>
              
              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                {contactInfo.map((contact, index) => {
                  const IconComponent = contact.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-3"
                    >
                      <IconComponent className="w-5 h-5 text-purple-400" />
                      {contact.href ? (
                        <a 
                          href={contact.href}
                          className="text-gray-300 hover:text-white transition-colors duration-300 font-sans"
                        >
                          {contact.text}
                        </a>
                      ) : (
                        <span className="text-gray-300 font-sans">{contact.text}</span>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Social Links */}
              <div className="flex gap-4">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.1, y: -2 }}
                      className={`w-12 h-12 bg-gray-800 dark:bg-gray-900 rounded-lg flex items-center justify-center text-gray-400 ${social.color} transition-all duration-300`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>

            {/* Navigation Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold text-white mb-6 font-sans">Navigation</h4>
              <ul className="space-y-3">
                {navigationLinks.map((link, index) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-300 font-sans"
                    >
                      {link.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Documents & Downloads */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold text-white mb-6 font-sans">Documents</h4>
              <ul className="space-y-3">
                {documents.map((doc, index) => (
                  <motion.li
                    key={doc.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    {doc.onClick ? (
                      <button
                        onClick={doc.onClick}
                        className="text-gray-400 hover:text-white transition-colors duration-300 font-sans text-left"
                      >
                        {doc.name}
                      </button>
                    ) : (
                      <a
                        href={doc.href}
                        className="text-gray-400 hover:text-white transition-colors duration-300 font-sans"
                      >
                        {doc.name}
                      </a>
                    )}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Services */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold text-white mb-6 font-sans">Services</h4>
              <ul className="space-y-3">
                {services.map((service, index) => (
                  <motion.li
                    key={service.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <a
                      href={service.href}
                      className="text-gray-400 hover:text-white transition-colors duration-300 font-sans"
                    >
                      {service.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="py-8 flex flex-col md:flex-row justify-between items-center gap-4"
            >
              {/* Copyright */}
              <div className="flex items-center gap-2 text-gray-400 font-sans">
                <span>© {currentYear} Urmi Chakraborty. All rights reserved.</span>
              </div>

              {/* Made with love */}
              <div className="flex items-center gap-2 text-gray-400 font-sans">
                <span>Made with</span>
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0] 
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse" 
                  }}
                >
                  <HiHeart className="w-5 h-5 text-red-500" />
                </motion.div>
                <span>in Kolkata</span>
              </div>

              {/* Professional Note */}
              <div className="text-sm text-gray-500 font-sans text-center md:text-right">
                <p>Available for remote work globally</p>
                <p className="text-xs mt-1">Journalist • Content Writer • Storyteller • V1.0</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <motion.button
        onClick={scrollToTop}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: showBackToTop ? 1 : 0,
          scale: showBackToTop ? 1 : 0.8,
          y: showBackToTop ? 0 : 20
        }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
        style={{ 
          pointerEvents: showBackToTop ? 'auto' : 'none',
          transform: showBackToTop ? 'translateY(0)' : 'translateY(20px)'
        }}
      >
        <HiArrowUp className="w-6 h-6" />
      </motion.button>
    </footer>
  );
};

export default Footer; 