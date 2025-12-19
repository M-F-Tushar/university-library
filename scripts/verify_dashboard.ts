import { getDashboardData } from "../lib/personalization/actions";

async function main() {
    try {
        console.log("Fetching dashboard data...");
        // Mock auth? No, getDashboardData uses auth(). This might fail if run standalone without session.
        // Instead, let's just run the prisma query directly here to check the model.

        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();

        console.log("Querying Course model...");
        const courses = await prisma.course.findMany({ take: 1 });

        if (courses.length > 0) {
            console.log("Course keys:", Object.keys(courses[0]));
        } else {
            console.log("No courses found to verify.");
        }

        console.log("Querying UserActivity model...");
        const activities = await prisma.userActivity.findMany({ take: 1 });
        if (activities.length > 0) {
            console.log("UserActivity keys:", Object.keys(activities[0]));
        } else {
            console.log("No activities found.");
        }

    } catch (e) {
        console.error(e);
    }
}

main();
