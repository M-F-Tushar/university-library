import Link from 'next/link';
import Image from 'next/image';
import { BookOpenIcon, AcademicCapIcon, DocumentTextIcon, SparklesIcon } from '@heroicons/react/24/outline';
import prisma from '@/lib/prisma';

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

  // Icon mapping
  const iconMap: Record<string, any> = {
    BookOpenIcon,
    AcademicCapIcon,
    DocumentTextIcon,
  };

  return (
    <main>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-violet-600 to-purple-700 dark:from-blue-900 dark:via-violet-900 dark:to-purple-950 text-white" suppressHydrationWarning>
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20" suppressHydrationWarning>
          <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-white/10 blur-3xl animate-pulse" suppressHydrationWarning></div>
          <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-white/10 blur-3xl animate-pulse delay-1000" suppressHydrationWarning></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32" suppressHydrationWarning>
          <div className="text-center" suppressHydrationWarning>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 text-sm font-medium border border-white/20" suppressHydrationWarning>
              <SparklesIcon className="h-4 w-4" />
              <span>{heroBadge}</span>
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
              <span className="block">{heroTitle1}</span>
              <span className="block bg-gradient-to-r from-blue-200 to-violet-200 bg-clip-text text-transparent">
                {heroTitle2}
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-xl text-blue-100 leading-relaxed">
              {heroSubtitle}
            </p>
            <div className="mt-10 flex justify-center" suppressHydrationWarning>
              <Link
                href={heroCta1Link}
                className="group relative inline-flex items-center justify-center rounded-xl bg-white dark:bg-gray-900 px-8 py-4 text-base font-semibold text-blue-600 dark:text-blue-400 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200"
              >
                <BookOpenIcon className="mr-2 h-5 w-5" />
                {heroCta1Text}
                <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 opacity-0 group-hover:opacity-10 transition-opacity"></span>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 text-center" suppressHydrationWarning>
              <div suppressHydrationWarning>
                <div className="text-4xl font-bold" suppressHydrationWarning>{statResourcesNum}</div>
                <div className="mt-1 text-sm text-blue-200" suppressHydrationWarning>{statResourcesLabel}</div>
              </div>
              <div suppressHydrationWarning>
                <div className="text-4xl font-bold" suppressHydrationWarning>{statStudentsNum}</div>
                <div className="mt-1 text-sm text-blue-200" suppressHydrationWarning>{statStudentsLabel}</div>
              </div>
              <div suppressHydrationWarning>
                <div className="text-4xl font-bold" suppressHydrationWarning>{statAccessNum}</div>
                <div className="mt-1 text-sm text-blue-200" suppressHydrationWarning>{statAccessLabel}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black" suppressHydrationWarning>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" suppressHydrationWarning>
          <div className="text-center mb-16" suppressHydrationWarning>
            <h2 className="text-base font-semibold text-blue-600 dark:text-blue-400 tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent sm:text-5xl">
              {featuresTitle}
            </p>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
              {featuresSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3" suppressHydrationWarning>
            {features.map((feature: { id: string; title: string; description: string; icon: string; link?: string | null; coverImage?: string | null }) => {
              const Icon = iconMap[feature.icon] || BookOpenIcon;
              const CardContent = (
                <div className={`group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 ${feature.link ? 'cursor-pointer' : ''}`} suppressHydrationWarning>
                  <div className="relative" suppressHydrationWarning>
                    {feature.coverImage ? (
                      <div className="relative h-48 w-full mb-6">
                        <Image
                          src={feature.coverImage || ''}
                          alt={feature.title}
                          fill
                          className="object-cover rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    ) : (
                      <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg group-hover:scale-110 transition-transform duration-300 mb-6" suppressHydrationWarning>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{feature.title}</h3>
                    <p className="mt-3 text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );

              return feature.link ? (
                <Link key={feature.id} href={feature.link} suppressHydrationWarning>
                  {CardContent}
                </Link>
              ) : (
                <div key={feature.id} suppressHydrationWarning>
                  {CardContent}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
