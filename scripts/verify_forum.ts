import { createDiscussion, createReply, getCourseDiscussions, getDiscussionDetails } from "../lib/forum/actions";

async function main() {
    // Mock session by assuming auth() in actions will fail or returns null if we strictly run this.
    // However, actions.ts uses `auth()`. 
    // If I run this with `npx tsx`, `auth()` will likely return null unless mocked or Env has session.
    // So this integration test might fail on "Unauthorized".
    // 
    // ALTERNATIVE: Use Prisma directly to test the MODELs, bypassing the actions' auth check.

    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    try {
        console.log("Fetching a course...");
        const course = await prisma.course.findFirst();
        if (!course) {
            console.log("No course found.");
            return;
        }

        console.log("Fetching a user...");
        const user = await prisma.user.findFirst();
        if (!user) {
            console.log("No user found.");
            return;
        }

        console.log(`Creating discussion for course ${course.courseCode} by user ${user.name}`);
        const discussion = await prisma.forumDiscussion.create({
            data: {
                title: "Test Discussion Title",
                content: "This is a test content verified by script.",
                courseId: course.id,
                authorId: user.id
            }
        });
        console.log("Discussion created:", discussion.id);

        console.log("Creating reply...");
        const reply = await prisma.forumReply.create({
            data: {
                content: "This is a test reply.",
                discussionId: discussion.id,
                authorId: user.id
            }
        });
        console.log("Reply created:", reply.id);

        console.log("Fetching details...");
        const fetched = await prisma.forumDiscussion.findUnique({
            where: { id: discussion.id },
            include: { replies: true, author: true }
        });

        if (fetched && fetched.replies.length > 0) {
            console.log("Verification SUCCESS: Discussion and Reply linked correctly.");
            // Clean up
            await prisma.forumDiscussion.delete({ where: { id: discussion.id } });
            console.log("Cleaned up test data.");
        } else {
            console.error("Verification FAILED: Could not fetch replies.");
        }

    } catch (e) {
        console.error(e);
    }
}

main();
