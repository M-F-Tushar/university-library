import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        console.log("Fetching a course...");
        const course = await prisma.course.findFirst({
            include: { resources: true }
        });

        if (!course) {
            console.log("No course found.");
            return;
        }

        console.log(`Course found: ${course.courseCode} with ${course.resources.length} resources.`);

        console.log("Creating a Past Paper resource...");
        // Ensure "Past Paper" type is used
        const paper = await prisma.resource.create({
            data: {
                title: "Test Past Paper 2023",
                resourceType: "Past Paper",
                fileUrl: "http://example.com/paper.pdf",
                courseId: course.id,
                uploadedById: (await prisma.user.findFirst())?.id || "unknown", // Need a user
                year: 2023,
                isApproved: true
            }
        });
        console.log("Created paper:", paper.id);

        console.log("Verifying filtering...");
        const fetchedCourse = await prisma.course.findUnique({
            where: { id: course.id },
            include: { resources: true }
        });

        if (fetchedCourse) {
            const papers = fetchedCourse.resources.filter(r => r.resourceType === 'Past Paper');
            const others = fetchedCourse.resources.filter(r => r.resourceType !== 'Past Paper');

            console.log(`Total Resources: ${fetchedCourse.resources.length}`);
            console.log(`Past Papers: ${papers.length}`);
            console.log(`Other Resources: ${others.length}`);

            if (papers.length > 0 && papers.find(p => p.id === paper.id)) {
                console.log("Verification SUCCESS: Past Paper found and filtered correctly.");
            } else {
                console.error("Verification FAILED: Created paper not found/filtered.");
            }

            // Clean up
            await prisma.resource.delete({ where: { id: paper.id } });
            console.log("Cleaned up test data.");
        }

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
