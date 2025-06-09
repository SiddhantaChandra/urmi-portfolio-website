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

  const handleNavItemClick = () => {
    // Close mobile menu when nav item is clicked
    setIsMobileMenuOpen(false);
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
            {navItems.map((item, idx) => (
              <a
                key={idx}
                href={item.link}
                onClick={handleNavItemClick}
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