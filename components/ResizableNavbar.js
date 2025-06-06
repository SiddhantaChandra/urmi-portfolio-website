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
          className="relative px-4 py-2 text-gray-900 hover:text-black dark:text-gray-100 dark:hover:text-white transition-colors duration-200 font-medium"
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
        y: visible ? 20 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 50,
      }}
      className={cn(
        "relative z-50 mx-auto flex w-full max-w-7xl flex-col items-center justify-between bg-transparent px-4 sm:px-6 lg:px-8 py-2 lg:hidden",
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            "absolute inset-x-0 top-16 z-50 flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-white dark:bg-gray-900 px-4 py-8 shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] dark:shadow-gray-900/20 border border-gray-200/20 dark:border-gray-700/20",
            className,
          )}
        >
          {children}
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
  return (
    <a
      href="#"
      className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-gray-900 dark:text-gray-100"
    >
      <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-sm">
        <span className="text-white font-bold text-sm">UC</span>
      </div>
      <span className="font-medium text-gray-900 dark:text-white">Urmi Chakraborty</span>
    </a>
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
    "px-4 py-2 rounded-md bg-white text-black text-sm font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center";
 
  const variantStyles = {
    primary:
      "shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] bg-white dark:bg-gray-800 text-black dark:text-white",
    secondary: "bg-transparent shadow-none text-gray-900 dark:text-gray-100",
    dark: "bg-black dark:bg-white text-white dark:text-black shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]",
    gradient:
      "bg-gradient-to-b from-blue-500 to-blue-700 dark:from-blue-400 dark:to-blue-600 text-white shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset]",
  };
 
  return (
    <Tag
      href={href || undefined}
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </Tag>
  );
}; 