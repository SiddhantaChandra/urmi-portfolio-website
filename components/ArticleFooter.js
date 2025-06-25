"use client";

import { motion } from 'framer-motion';
import { HiHeart } from 'react-icons/hi';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useTheme } from '../app/contexts/ThemeContext';

const ArticleFooter = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const currentYear = new Date().getFullYear();

  const handleHomeRedirect = () => {
    router.push('/');
  };

  const navigationLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '#about' },
    { name: 'Experience', href: '#experience' },
    { name: 'Work', href: '#work' },
    { name: 'Contact', href: '#contact' }
  ];

  const handleNavClick = (href) => {
    if (href === '/') {
      router.push('/');
    } else if (href.startsWith('#')) {
      router.push('/' + href);
    }
  };

  return (
    <footer className="bg-white/80 dark:bg-gray-900/80 border-t border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm mt-8 md:mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
          {/* Left Side - Logo and Text Combo - Clickable */}
          <motion.button
            onClick={handleHomeRedirect}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 group cursor-pointer"
            aria-label="Return to homepage"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg overflow-hidden shadow-sm group-hover:shadow-md transition-shadow duration-300">
              <Image 
                src="/logo.webp" 
                alt="Urmi Chakraborty Logo" 
                className="w-full h-full object-cover"
                width={40}
                height={40}
                priority
              />
            </div>
            <div className="text-left">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                Urmi Chakraborty
              </h3>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                Content Writer & Journalist
              </p>
            </div>
          </motion.button>

          {/* Right Side - Navigation Links (Desktop) */}
          <div className="hidden lg:flex items-center gap-6">
            {navigationLinks.map((link, index) => (
              <motion.button
                key={link.name}
                onClick={() => handleNavClick(link.href)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300 text-sm font-medium"
              >
                {link.name}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Mobile Navigation Links */}
        <div className="lg:hidden mt-6 flex flex-wrap justify-center gap-4">
          {navigationLinks.map((link, index) => (
            <motion.button
              key={link.name}
              onClick={() => handleNavClick(link.href)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300 text-sm font-medium px-3 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {link.name}
            </motion.button>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
          {/* Copyright and Made with Love */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 text-center sm:text-left">
              © {currentYear} Urmi Chakraborty. All rights reserved.
            </p>
            <div className="flex items-center gap-1 text-xs md:text-sm text-gray-500 dark:text-gray-400">
              <span>Made with</span>
              <HiHeart className="w-4 h-4 text-red-500" />
              <span>in Kolkata</span>
            </div>
          </div>

          {/* Professional Info */}
          <div className="text-center space-y-2">
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">
              Available for remote work globally
            </p>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-500">
              Journalist • Content Writer • Storyteller
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ArticleFooter; 