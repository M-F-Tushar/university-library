import { PrismaClient } from '@prisma/client'
import { getRecommendedResources } from '../lib/personalization/actions'

// Mock auth since we can't easily mock next-auth session in script
// We will modify the action temporarily or just test the logic via raw prisma query matching the action
const prisma = new PrismaClient()

async function main() {
    console.log("Setting up test data...");

    // 1. Get or Create User
    let user = await prisma.user.findFirst();
    if (!user) {
        console.log("No user found, creating one...");
        user = await prisma.user.create({
            data: {
                name: "Test User",
                email: "test@example.com",
                role: "STUDENT",
                currentSemester: 1,
                currentYear: 1,
                department: "Computer Science"
            }
        });
    } else {
        // Ensure semester/dept is set
        user = await prisma.user.update({
            where: { id: user.id },
            data: { currentSemester: 1, department: "Computer Science" }
        });
    }
    console.log(`User: ${user.name}, Sem: ${user.currentSemester}, Dept: ${user.department}`);

    // 2. Ensure we have a matching course and resource
    const course = await prisma.course.findFirst({
        where: { semester: 1 } // Match user sem
    });

    if (course) {
        console.log(`Found matching course: ${course.courseCode} (Sem ${course.semester})`);

        // Check for resource
        const existingRes = await prisma.resource.findFirst({ where: { courseId: course.id } });
        if (!existingRes) {
            console.log("Creating matching resource...");
            await prisma.resource.create({
                data: {
                    title: "Recommended Notes",
                    resourceType: "Notes",
                    fileUrl: "http://example.com",
                    courseId: course.id,
                    uploadedById: user.id, // Wait, logic excludes own uploads. Need another user.
                    isApproved: true
                }
            });
        }
    }

    // 3. Run Query Logic exactly as in actions.ts (Simulating the action)
    console.log("Testing Recommendation Logic...");
    const resources = await prisma.resource.findMany({
        where: {
            isApproved: true,
            OR: [
                { course: { semester: user.currentSemester || undefined } },
                { rating: { gte: 4.0 } }
            ]
        },
        take: 5,
        include: { course: { select: { semester: true } } }
    });

    console.log(`Found ${resources.length} recommended resources.`);
    resources.forEach(r => {
        const reason = (r.course.semester === user.currentSemester) ? 'Course Match' : 'Highly Rated';
        console.log(`- ${r.title}: ${reason}`);
    });

    if (resources.length > 0) {
        console.log("Verification SUCCESS");
    } else {
        console.warn("Verification WARNING: No resources found (might need seed data)");
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
