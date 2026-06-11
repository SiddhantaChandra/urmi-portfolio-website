import ResizableNavbarWrapper from '../components/ResizableNavbarWrapper';
import AceternityHero from '../sections/AceternityHero';
import AboutSection from '../sections/AboutSection';
import ExperienceSection from '../sections/ExperienceSection';
import WorkSection from '../sections/WorkSection';
import ContactSection from '../sections/ContactSection';
import Footer from '../components/Footer';
import prisma from '@/lib/prisma';

export default async function Home() {
  const profile = await prisma.profile.findFirst();
  const skills = await prisma.skill.findMany({ orderBy: { displayOrder: 'asc' } });
  const differentiators = await prisma.differentiator.findMany({ orderBy: { displayOrder: 'asc' } });
  const brands = await prisma.brand.findMany({ orderBy: { displayOrder: 'asc' } });
  const experiences = await prisma.experience.findMany({
    orderBy: { displayOrder: 'asc' },
    include: {
      achievements: { orderBy: { displayOrder: 'asc' } },
      skills: { orderBy: { displayOrder: 'asc' } },
    },
  });
  const contactInfo = await prisma.contactInfo.findMany({ orderBy: { displayOrder: 'asc' } });
  const resources = await prisma.resource.findMany({ orderBy: { displayOrder: 'asc' } });
  const articles = await prisma.article.findMany({
    where: { status: 'published' },
    orderBy: { displayOrder: 'asc' },
    include: {
      tags: {
        include: { tag: true },
      },
    },
  });

  return (
    <main className="relative min-h-screen font-sans bg-neutral-bg dark:bg-neutral-bg-dark transition-colors duration-300">
      <ResizableNavbarWrapper />
      
      {/* Hero Section */}
      <AceternityHero profile={profile} />
      
      {/* Other sections */}
      <AboutSection skills={skills} differentiators={differentiators} brands={brands} />
      <ExperienceSection experiences={experiences} />
      <WorkSection articles={articles} />
      <ContactSection contactInfo={contactInfo} resources={resources} />
      <Footer />
    </main>
  );
}
