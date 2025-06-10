"use client";

import { useState, useEffect } from 'react';
import ResizableNavbarWrapper from '../components/ResizableNavbarWrapper';
import AceternityHero from '../sections/AceternityHero';
import AboutSection from '../sections/AboutSection';
import ExperienceSection from '../sections/ExperienceSection';
import WorkSection from '../sections/WorkSection';
import ContactSection from '../sections/ContactSection';
import Footer from '../components/Footer';

export default function Home() {
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [resourcesPreloaded, setResourcesPreloaded] = useState(false);

  // Progressive preloading after hero is ready
  useEffect(() => {
    if (heroLoaded && !resourcesPreloaded) {
      const preloadResources = async () => {
        try {
          // Preload images for other sections
          const imagePromises = [
            new Promise((resolve) => {
              const img = new Image();
              img.onload = resolve;
              img.onerror = resolve; // Don't fail if image doesn't exist
              img.src = '/logo.webp';
            }),
            new Promise((resolve) => {
              const img = new Image();
              img.onload = resolve;
              img.onerror = resolve;
              img.src = '/Urmi.jpg';
            })
          ];

          // Preload fonts
          const fontPromise = document.fonts.ready.then(() => {
            if (!document.fonts.check('16px Inter')) {
              return document.fonts.load('16px Inter');
            }
          }).catch(() => {}); // Silent fail

          // Wait for all resources
          await Promise.allSettled([...imagePromises, fontPromise]);
          
          // Small delay to ensure smooth transition
          setTimeout(() => {
            setResourcesPreloaded(true);
          }, 100);
          
        } catch (error) {
          console.warn('Preload warning:', error);
          // Fallback: mark as preloaded anyway
          setResourcesPreloaded(true);
        }
      };

      preloadResources();
    }
  }, [heroLoaded, resourcesPreloaded]);

  return (
    <main className="relative min-h-screen font-sans bg-white dark:bg-gray-900 transition-colors duration-300">
      <ResizableNavbarWrapper />
      
      {/* Hero Section - Loads immediately */}
      <AceternityHero onLoaded={() => setHeroLoaded(true)} />
      
      {/* Other sections - Load after hero */}
      {heroLoaded && (
        <>
          <AboutSection />
          <ExperienceSection />
          <WorkSection />
          <ContactSection preloaded={resourcesPreloaded} />
          <Footer />
        </>
      )}
    </main>
  );
}
