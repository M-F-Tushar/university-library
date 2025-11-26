const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding CMS data...');

    // Seed Site Settings
    const siteSettings = [
        // Hero Section
        { key: 'hero_title_line1', value: 'University Digital', category: 'hero', type: 'text', description: 'Hero title first line' },
        { key: 'hero_title_line2', value: 'Library', category: 'hero', type: 'text', description: 'Hero title second line' },
        { key: 'hero_subtitle', value: 'Access thousands of books, past questions, notes, and resources anytime, anywhere. Your complete academic resource center.', category: 'hero', type: 'text', description: 'Hero subtitle/tagline' },
        { key: 'hero_badge_text', value: 'Your Digital Learning Hub', category: 'hero', type: 'text', description: 'Hero badge text' },
        { key: 'hero_cta1_text', value: 'Browse Resources', category: 'hero', type: 'text', description: 'Primary CTA button text' },
        { key: 'hero_cta1_link', value: '/resources', category: 'hero', type: 'text', description: 'Primary CTA button link' },
        { key: 'hero_cta2_text', value: 'Get Started', category: 'hero', type: 'text', description: 'Secondary CTA button text' },
        { key: 'hero_cta2_link', value: '/register', category: 'hero', type: 'text', description: 'Secondary CTA button link' },

        // Statistics
        { key: 'stat_resources_number', value: '1000+', category: 'stats', type: 'text', description: 'Resources count display' },
        { key: 'stat_resources_label', value: 'Resources', category: 'stats', type: 'text', description: 'Resources label' },
        { key: 'stat_students_number', value: '500+', category: 'stats', type: 'text', description: 'Students count display' },
        { key: 'stat_students_label', value: 'Students', category: 'stats', type: 'text', description: 'Students label' },
        { key: 'stat_access_number', value: '24/7', category: 'stats', type: 'text', description: 'Access hours display' },
        { key: 'stat_access_label', value: 'Access', category: 'stats', type: 'text', description: 'Access label' },

        // Features Section
        { key: 'features_title', value: 'Everything You Need to Succeed', category: 'features', type: 'text', description: 'Features section title' },
        { key: 'features_subtitle', value: 'Comprehensive resources for your academic journey', category: 'features', type: 'text', description: 'Features section subtitle' },

        // General
        { key: 'site_name', value: 'UniLibrary', category: 'general', type: 'text', description: 'Site name' },
    ];

    for (const setting of siteSettings) {
        await prisma.siteSettings.upsert({
            where: { key: setting.key },
            update: setting,
            create: setting,
        });
    }

    console.log('✅ Site settings seeded');

    // Seed Features
    const features = [
        {
            title: 'Digital Books',
            description: 'Access a vast collection of digital textbooks and reference materials across all departments.',
            icon: 'BookOpenIcon',
            colorFrom: 'blue-500',
            colorTo: 'blue-600',
            order: 1,
            isActive: true,
        },
        {
            title: 'Past Questions',
            description: 'Prepare for exams with our comprehensive archive of past question papers and solutions.',
            icon: 'AcademicCapIcon',
            colorFrom: 'violet-500',
            colorTo: 'violet-600',
            order: 2,
            isActive: true,
        },
        {
            title: 'Lecture Notes',
            description: 'Download lecture notes and slides shared by professors and fellow students.',
            icon: 'DocumentTextIcon',
            colorFrom: 'purple-500',
            colorTo: 'purple-600',
            order: 3,
            isActive: true,
        },
    ];

    for (const feature of features) {
        await prisma.feature.create({
            data: feature,
        });
    }

    console.log('✅ Features seeded');

    // Seed a sample announcement
    await prisma.announcement.create({
        data: {
            title: 'Welcome to the New Library!',
            content: 'We have upgraded our digital library with a modern interface and new features. Explore and enjoy!',
            type: 'info',
            isActive: true,
        },
    });

    console.log('✅ Announcements seeded');
    console.log('🎉 CMS seeding complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
