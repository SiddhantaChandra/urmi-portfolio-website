"use client";

import ResizableNavbarWrapper from '../components/ResizableNavbarWrapper';
import AceternityHero from '../sections/AceternityHero';
import AboutSection from '../sections/AboutSection';
import ExperienceSection from '../sections/ExperienceSection';
import WorkSection from '../sections/WorkSection';
import ContactSection from '../sections/ContactSection';

export default function Home() {
  return (
    <main className="relative min-h-screen font-sans bg-white dark:bg-gray-900 transition-colors duration-300">
      <ResizableNavbarWrapper />
      <AceternityHero />
      <AboutSection />
      <ExperienceSection />
      <WorkSection />
      <ContactSection />
      </main>
  );
}
