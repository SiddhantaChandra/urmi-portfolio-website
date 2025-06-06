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
    { name: 'Testimonials', link: '#testimonials' },
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
                className="text-gray-900 hover:text-black dark:text-gray-100 dark:hover:text-white transition-colors duration-200 font-medium"
              >
                {item.name}
              </a>
            ))}
            <NavbarButton 
              href="#contact"
              variant="gradient"
              className="mt-4 w-full text-center"
            >
              Let&apos;s Connect
            </NavbarButton>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </>
  );
};

export default ResizableNavbarWrapper; 