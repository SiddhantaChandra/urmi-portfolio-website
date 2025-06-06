"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
  setTheme: () => {},
  isDark: false
});

export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  // Return default values if context is not available (during SSR or before provider mounts)
  if (!context) {
    return {
      theme: 'light',
      toggleTheme: () => {},
      setTheme: () => {},
      isDark: false
    };
  }
  
  return context;
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  // Handle theme initialization and persistence
  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      const initialTheme = savedTheme || systemTheme;
      
      setTheme(initialTheme);
      setMounted(true);
      
      // Apply theme to document
      if (initialTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        if (!localStorage.getItem('theme')) {
          const newTheme = e.matches ? 'dark' : 'light';
          setTheme(newTheme);
          if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      };

      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  const toggleTheme = () => {
    if (typeof window !== 'undefined') {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      
      setTheme(newTheme);
      localStorage.setItem('theme', newTheme);
      
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const setSpecificTheme = (newTheme) => {
    if (typeof window !== 'undefined') {
      setTheme(newTheme);
      localStorage.setItem('theme', newTheme);
      
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  // Prevent hydration mismatch by rendering a placeholder until mounted
  if (!mounted) {
    return (
      <ThemeContext.Provider value={{
        theme: 'light',
        toggleTheme: () => {},
        setTheme: () => {},
        isDark: false
      }}>
        <div style={{ visibility: 'hidden' }}>{children}</div>
      </ThemeContext.Provider>
    );
  }

  const contextValue = {
    theme,
    toggleTheme,
    setTheme: setSpecificTheme,
    isDark: theme === 'dark'
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider; 