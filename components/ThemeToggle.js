"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../app/contexts/ThemeContext';
import { IconSun, IconMoon } from '@tabler/icons-react';
import { cn } from '../utils/cn';

const ThemeToggle = ({ className, size = 'default' }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  const sizeClasses = {
    small: 'w-8 h-8',
    default: 'w-10 h-10',
    large: 'w-12 h-12'
  };

  const iconSizes = {
    small: 16,
    default: 20,
    large: 24
  };

  // Don't render if theme is not available yet
  if (!theme) {
    return (
      <div className={cn(
        "flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse",
        sizeClasses[size],
        className
      )} />
    );
  }

  const handleToggle = () => {
    if (toggleTheme) {
      toggleTheme();
    }
  };

  return (
    <motion.button
      onClick={handleToggle}
      className={cn(
        "relative flex items-center justify-center rounded-full transition-all duration-300",
        "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600",
        "border border-gray-300 dark:border-gray-600",
        "shadow-sm hover:shadow-md",
        "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800",
        sizeClasses[size],
        className
      )}
      initial={false}
      animate={{
        scale: [1, 0.95, 1],
      }}
      transition={{
        duration: 0.2,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: isDark ? 180 : 0,
          opacity: [0.7, 1, 0.7, 1],
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut"
        }}
        className="flex items-center justify-center"
      >
        {isDark ? (
          <IconMoon 
            size={iconSizes[size]} 
            className="text-yellow-500 drop-shadow-sm" 
          />
        ) : (
          <IconSun 
            size={iconSizes[size]} 
            className="text-orange-500 drop-shadow-sm" 
          />
        )}
      </motion.div>
      
      {/* Subtle glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        initial={false}
        animate={{
          boxShadow: isDark 
            ? "0 0 20px rgba(251, 191, 36, 0.3)" 
            : "0 0 20px rgba(249, 115, 22, 0.3)",
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
};

// Advanced toggle with text labels
export const ThemeToggleWithLabel = ({ className, showLabel = true }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  // Don't render if theme is not available yet
  if (!theme) {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        {showLabel && (
          <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        )}
        <div className="w-14 h-7 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
      </div>
    );
  }

  const handleToggle = () => {
    if (toggleTheme) {
      toggleTheme();
    }
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {showLabel && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {theme === 'light' ? 'Light' : 'Dark'} Mode
        </span>
      )}
      
      <motion.button
        onClick={handleToggle}
        className={cn(
          "relative flex items-center w-14 h-7 rounded-full transition-all duration-300",
          "bg-gray-300 dark:bg-gray-600",
          "border-2 border-gray-400 dark:border-gray-500",
          "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        )}
        initial={false}
        animate={{
          backgroundColor: isDark ? "#4B5563" : "#D1D5DB",
          borderColor: isDark ? "#6B7280" : "#9CA3AF",
        }}
        transition={{ duration: 0.3 }}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        <motion.div
          className={cn(
            "absolute w-5 h-5 rounded-full flex items-center justify-center",
            "bg-white dark:bg-gray-200 shadow-md"
          )}
          initial={false}
          animate={{
            x: isDark ? 26 : 2,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30
          }}
        >
          <motion.div
            initial={false}
            animate={{ rotate: isDark ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isDark ? (
              <IconMoon size={12} className="text-gray-600" />
            ) : (
              <IconSun size={12} className="text-orange-500" />
            )}
          </motion.div>
        </motion.div>
      </motion.button>
    </div>
  );
};

export default ThemeToggle; 