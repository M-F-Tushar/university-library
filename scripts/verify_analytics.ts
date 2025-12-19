import { PrismaClient } from '@prisma/client'
import { getStudentAnalytics } from '../lib/analytics/student-actions'

const prisma = new PrismaClient()

async function main() {
    // 1. Get a user
    const user = await prisma.user.findFirst();
    if (!user) {
        console.log("No user found.");
        return;
    }
    console.log(`Testing analytics for user: ${user.email}`);

    // 2. Run the action (simulated since we can't fully mock auth in script easily without a helper)
    // We'll just verify the prisma calls used in the action are valid
    try {
        console.log("Checking UserActivity...");
        const count = await prisma.userActivity.count({ where: { userId: user.id } });
        console.log(`UserActivity count: ${count}`);

        console.log("Checking StudentGrade...");
        // This is the one we think might fail if name is wrong
        // @ts-ignore
        const grades = await prisma.studentGrade.findMany({
            where: { userId: user.id },
            include: { course: true }
        });
        console.log(`Grades found: ${grades.length}`);

    } catch (e) {
        console.error("Error accessing models:", e);
    }
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect())
