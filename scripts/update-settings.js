const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Updating Site Settings to CS Focus...');

    const updates = [
        { key: 'hero_title_line1', value: 'CS Student' },
        { key: 'hero_title_line2', value: 'Digital Library' },
        { key: 'hero_subtitle', value: 'Master algorithms, data structures, and software engineering with our curated resources.' },
        { key: 'hero_badge_text', value: 'For CS Students By CS Students' },
        { key: 'stat_students_label', value: 'Developers' },
        { key: 'features_title', value: 'Level Up Your Coding Skills' },
        { key: 'features_subtitle', value: 'Resources tailored for your Computer Science journey' },
        { key: 'site_name', value: 'CS Lib' },
    ];

    for (const update of updates) {
        await prisma.siteSettings.update({
            where: { key: update.key },
            data: { value: update.value },
        });
    }

    console.log('✅ Site settings updated');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
