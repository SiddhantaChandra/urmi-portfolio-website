"use client";

import React, { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavbarLogo,
  NavbarButton
} from './ResizableNavbar';

const ResizableNavbarWrapper = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'About', link: '#about' },
    { name: 'Experience', link: '#experience' },
    { name: 'Portfolio', link: '#work' },
    { name: 'Contact', link: '#contact' }
  ];

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  const handleMobileNavClick = (e, href) => {
    // Close mobile menu immediately
    setIsMobileMenuOpen(false);
    
    // Don't prevent default for mobile - let browser handle navigation
    // Just add a small delay for smooth UX
    if (href && href.startsWith('#')) {
      setTimeout(() => {
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          const navbar = document.querySelector('nav');
          const navbarHeight = navbar ? navbar.offsetHeight : 80;
          
          window.scrollTo({
            top: targetElement.offsetTop - navbarHeight,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  };

  const handleNavItemClick = (e, href) => {
    // For mobile browsers, let the default navigation work
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
      // Close mobile menu first
      setIsMobileMenuOpen(false);
      
      // For mobile, use a small delay then let browser handle navigation
      if (href && href.startsWith('#')) {
        setTimeout(() => {
          const targetId = href.substring(1);
          const targetElement = document.getElementById(targetId);
          
          if (targetElement) {
            // Use a more mobile-friendly scroll approach
            window.scrollTo({
              top: targetElement.offsetTop - 80, // Account for navbar height
              behavior: 'smooth'
            });
          }
        }, 300); // Small delay to let menu close animation complete
      }
    } else {
      // Desktop behavior with preventDefault
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    }
  };

  return (
    <>
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems 
            items={navItems} 
            onItemClick={handleNavItemClick}
          />
          <div className="flex items-center gap-3">
            <ThemeToggle size="small" />
            <NavbarButton 
              href="#contact"
              variant="dark"
              onClick={(e) => handleNavItemClick(e, '#contact')}
            >
              Let&apos;s Connect
            </NavbarButton>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <div className="flex items-center gap-2">
              <ThemeToggle size="small" />
              <MobileNavToggle 
                isOpen={isMobileMenuOpen}
                onClick={handleMobileMenuToggle}
              />
            </div>
          </MobileNavHeader>
          
          <MobileNavMenu 
            isOpen={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
          >
            {navItems.filter(item => item.name !== 'Contact').map((item, idx) => (
              <a
                key={idx}
                href={item.link}
                onClick={(e) => handleMobileNavClick(e, item.link)}
                className="block w-full py-6 px-4 text-gray-900 hover:text-purple-600 dark:text-gray-100 dark:hover:text-purple-400 transition-colors duration-200 font-medium text-center rounded-lg hover:bg-purple-50/50 dark:hover:bg-purple-900/20"
              >
                {item.name}
              </a>
            ))}
            <div className="mt-8 px-2">
              <NavbarButton 
                href="#contact"
                variant="mobile"
                className="w-full text-center px-6 py-3 text-base font-semibold"
                onClick={(e) => handleMobileNavClick(e, '#contact')}
              >
                Let&apos;s Connect
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </>
  );
};

export default ResizableNavbarWrapper; 