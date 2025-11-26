
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const semesters = [
    { name: '1st Semester', value: '1st', description: 'Foundational courses and basics.', order: 1 },
    { name: '2nd Semester', value: '2nd', description: 'Core programming and math.', order: 2 },
    { name: '3rd Semester', value: '3rd', description: 'Data structures and algorithms.', order: 3 },
    { name: '4th Semester', value: '4th', description: 'Computer architecture and systems.', order: 4 },
    { name: '5th Semester', value: '5th', description: 'Operating systems and databases.', order: 5 },
    { name: '6th Semester', value: '6th', description: 'Software engineering and networks.', order: 6 },
    { name: '7th Semester', value: '7th', description: 'Advanced electives and AI.', order: 7 },
    { name: '8th Semester', value: '8th', description: 'Final project and thesis.', order: 8 },
];

async function main() {
    console.log('Seeding semesters...');
    for (const sem of semesters) {
        await prisma.semester.upsert({
            where: { value: sem.value },
            update: sem,
            create: sem,
        });
    }
    console.log('Semesters seeded successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
