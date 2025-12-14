import prisma from '@/lib/prisma';
import { HeroSection } from '@/components/home/HeroSection';
import { StatsSection } from '@/components/home/StatsSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';

// Use Incremental Static Regeneration (ISR) for better performance
export const revalidate = 60; // Revalidate every 60 seconds

// Helper function to get setting value
async function getSetting(key: string, defaultValue: string = '') {
  const setting = await prisma.siteSettings.findUnique({ where: { key } });
  return setting?.value || defaultValue;
}

export default async function Home() {
  // Fetch dynamic content from database
  const [
    heroTitle1,
    heroTitle2,
    heroSubtitle,
    heroBadge,
    heroCta1Text,
    heroCta1Link,
    heroCta2Text,
    heroCta2Link,
    statResourcesNum,
    statResourcesLabel,
    statStudentsNum,
    statStudentsLabel,
    statAccessNum,
    statAccessLabel,
    featuresTitle,
    featuresSubtitle,
  ] = await Promise.all([
    getSetting('hero_title_line1', 'CS Student'),
    getSetting('hero_title_line2', 'Digital Library'),
    getSetting('hero_subtitle', 'Master algorithms, data structures, and software engineering with our curated resources.'),
    getSetting('hero_badge_text', 'For CS Students By CS Students'),
    getSetting('hero_cta1_text', 'Browse Resources'),
    getSetting('hero_cta1_link', '/resources'),
    getSetting('hero_cta2_text', 'Get Started'),
    getSetting('hero_cta2_link', '/register'),
    prisma.resource.count().then(count => count.toString()),
    getSetting('stat_resources_label', 'Resources'),
    prisma.user.count().then(count => count.toString()),
    getSetting('stat_students_label', 'Developers'),
    getSetting('stat_access_number', '24/7'),
    getSetting('stat_access_label', 'Access'),
    getSetting('features_title', 'Level Up Your Coding Skills'),
    getSetting('features_subtitle', 'Resources tailored for your Computer Science journey'),
  ]);

  const features = await prisma.feature.findMany({ where: { isActive: true }, orderBy: { createdAt: 'asc' } });

  return (
    <main className="flex flex-col min-h-screen">
      <HeroSection
        title1={heroTitle1}
        title2={heroTitle2}
        subtitle={heroSubtitle}
        badge={heroBadge}
        cta1Text={heroCta1Text}
        cta1Link={heroCta1Link}
        cta2Text={heroCta2Text}
        cta2Link={heroCta2Link}
      />

      <StatsSection
        stats={{
          resourcesNum: statResourcesNum,
          resourcesLabel: statResourcesLabel,
          studentsNum: statStudentsNum,
          studentsLabel: statStudentsLabel,
          accessNum: statAccessNum,
          accessLabel: statAccessLabel,
        }}
      />

      <FeaturesSection
        title={featuresTitle}
        subtitle={featuresSubtitle}
        features={features}
      />
    </main>
  );
}

