"use client";
import { cn } from "../utils/cn";
import { IconMenu2, IconX } from "@tabler/icons-react";
import {
  motion,
  AnimatePresence,
  useScroll,
} from "framer-motion";
 
import React, { useRef, useState, useEffect } from "react";
 
 
// Main Navbar Container
export const Navbar = ({ children, className }) => {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
 
  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      if (latest > 100) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    });

    return () => unsubscribe();
  }, [scrollY]);
 
  return (
    <div className={cn("fixed inset-x-0 top-0 z-50 w-full", className)}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(
              child,
              { visible },
            )
          : child,
      )}
    </div>
  );
};
 
// Desktop Nav Body
export const NavBody = ({ children, className, visible }) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(10px)" : "none",
        boxShadow: visible
          ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
          : "none",
        y: visible ? 20 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 50,
      }}
      className={cn(
        "relative z-[60] mx-auto hidden w-full max-w-7xl flex-row items-center justify-between self-start rounded-full bg-transparent px-4 sm:px-6 lg:px-8 py-2 lg:flex",
        visible && "bg-white/90 dark:bg-gray-900/90 border border-gray-200/20 dark:border-gray-700/20 shadow-lg dark:shadow-gray-900/20",
        className,
      )}
    >
      {children}
    </motion.div>
  );
};
 
// Nav Items
export const NavItems = ({ items, className, onItemClick }) => {
  const [hovered, setHovered] = useState(null);
 
  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-2 text-sm font-medium text-gray-900 dark:text-gray-100 transition duration-200 lg:flex lg:space-x-2",
        className,
      )}
    >
      {items.map((item, idx) => (
        <a
          onMouseEnter={() => setHovered(idx)}
          onClick={onItemClick}
          className="relative px-4 py-2 text-gray-900 hover:text-black dark:text-gray-100 dark:hover:text-white transition-colors duration-150 font-medium"
          key={`link-${idx}`}
          href={item.link}
        >
          {hovered === idx && (
            <motion.div
              layoutId="hovered"
              className="absolute inset-0 h-full w-full rounded-full bg-gray-100 dark:bg-gray-800"
            />
          )}
          <span className="relative z-20">{item.name}</span>
        </a>
      ))}
    </motion.div>
  );
};
 
// Mobile Nav
export const MobileNav = ({ children, className, visible }) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(10px)" : "none",
        boxShadow: visible
          ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
          : "none",
        y: 0,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 50,
      }}
      className={cn(
        "relative z-50 mx-auto w-full max-w-7xl bg-transparent px-4 sm:px-6 lg:px-8 py-2 lg:hidden",
        visible && "bg-white/90 dark:bg-gray-900/90 border border-gray-200/20 dark:border-gray-700/20 shadow-lg dark:shadow-gray-900/20 rounded-lg",
        className,
      )}
    >
      {children}
    </motion.div>
  );
};
 
// Mobile Nav Header
export const MobileNavHeader = ({ children, className }) => {
  return (
    <div
      className={cn(
        "flex w-full flex-row items-center justify-between",
        className,
      )}
    >
      {children}
    </div>
  );
};
 
// Mobile Nav Menu
export const MobileNavMenu = ({ children, className, isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={cn(
            "w-full mt-4 overflow-hidden",
            className,
          )}
        >
          <div className="flex flex-col space-y-1 py-4 px-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-lg border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
 
// Mobile Nav Toggle
export const MobileNavToggle = ({ isOpen, onClick }) => {
  return isOpen ? (
    <IconX className="text-black dark:text-white cursor-pointer" onClick={onClick} />
  ) : (
    <IconMenu2 className="text-black dark:text-white cursor-pointer" onClick={onClick} />
  );
};
 
// Navbar Logo
export const NavbarLogo = () => {
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHasAnimated(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.a
      href="#"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative z-20 mr-4 flex items-center space-x-4 px-3 py-2 group cursor-pointer"
    >
            {/* Gradient Typography Logo */}
      <div className="relative flex items-center space-x-3">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-lg blur-lg opacity-0 group-hover:opacity-20 transition-all duration-500" />
        
        {/* Logo Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: hasAnimated ? 1 : 0,
            scale: hasAnimated ? 1 : 0.8
          }}
          transition={{ 
            duration: 0.5,
            ease: "easeOut"
          }}
          className="relative flex-shrink-0"
        >
          <div className="w-10 h-10 rounded-lg overflow-hidden shadow-md">
            <img src="/logo.webp"
              alt="Urmi Chakraborty Logo" 
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
        
        {/* Minimal Logo Text */}
        <div className="relative flex items-baseline">
          {/* Mobile: Just "Urmi" */}
          <motion.div className="flex items-baseline md:hidden">
            {['U', 'r', 'm', 'i'].map((letter, index) => (
              <motion.span
                key={`mobile-${index}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ 
                  opacity: hasAnimated ? 1 : 0, 
                  y: hasAnimated ? 0 : 15
                }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                className="font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent"
                style={{
                  fontFamily: "'Inter', system-ui, sans-serif"
                }}
              >
                {letter}
              </motion.span>
            ))}
          </motion.div>

          {/* Desktop: Full Name */}
          <motion.div className="hidden md:flex items-baseline">
            {/* First Name */}
            <div className="flex items-baseline">
              {['U', 'r', 'm', 'i'].map((letter, index) => (
                <motion.span
                  key={`desktop-first-${index}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ 
                    opacity: hasAnimated ? 1 : 0, 
                    y: hasAnimated ? 0 : 15
                  }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.08,
                    ease: "easeOut"
                  }}
                  className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent"
                  style={{
                    fontFamily: "'Inter', system-ui, sans-serif"
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>

            {/* Space */}
            <span className="mx-1"></span>

            {/* Last Name */}
            <div className="flex items-baseline">
              {['C', 'h', 'a', 'k', 'r', 'a', 'b', 'o', 'r', 't', 'y'].map((letter, index) => (
                <motion.span
                  key={`desktop-last-${index}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ 
                    opacity: hasAnimated ? 1 : 0, 
                    y: hasAnimated ? 0 : 15
                  }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.4 + (index * 0.04),
                    ease: "easeOut"
                  }}
                  className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent"
                  style={{
                    fontFamily: "'Inter', system-ui, sans-serif"
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>


      </div>

      {/* Hover Glow Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        whileHover={{ scale: 1.05 }}
      />
    </motion.a>
  );
};
 
// Navbar Button
export const NavbarButton = ({
  href,
  as: Tag = "a",
  children,
  className,
  variant = "primary",
  ...props
}) => {
  const baseStyles =
    "px-4 py-2 rounded-lg text-sm font-bold relative cursor-pointer inline-block text-center transition-all duration-200";
 
  const variantStyles = {
    primary:
      "shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] bg-white dark:bg-gray-800 text-black dark:text-white hover:-translate-y-0.5",
    secondary: "bg-transparent shadow-none text-gray-900 dark:text-gray-100",
    dark: "bg-black dark:bg-white text-white dark:text-black shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] hover:-translate-y-0.5",
    gradient:
      "bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 text-white shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-pink-700 dark:hover:from-purple-600 dark:hover:to-pink-600 border border-purple-200/50 dark:border-purple-400/30 hover:-translate-y-0.5 hover:scale-105",
    mobile:
      "bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 text-white shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-pink-700 dark:hover:from-purple-600 dark:hover:to-pink-600 border border-purple-200/50 dark:border-purple-400/30 font-semibold hover:scale-105",
  };

  const MotionTag = motion(Tag);
 
  return (
    <MotionTag
      href={href || undefined}
      whileHover={{ y: variant === 'mobile' ? 0 : -2, scale: variant === 'mobile' ? 1 : 1 }}
      whileTap={{ scale: variant === 'mobile' ? 1 : 0.98 }}
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </MotionTag>
  );
}; 