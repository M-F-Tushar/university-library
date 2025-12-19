import { PrismaClient } from '@prisma/client'
import { getReviewCandidate, submitPeerReview, getMyReviews } from '../lib/reviews/peer-actions'

const prisma = new PrismaClient()

async function main() {
    console.log("Starting Peer Review Verification...");

    const user = await prisma.user.findFirst();
    if (!user) return console.log("No user");

    const course = await prisma.course.findFirst();
    if (!course) return console.log("No course");

    // 1. Ensure a submission exists from ANOTHER user
    const otherUser = await prisma.user.findFirst({ where: { id: { not: user.id } } });
    if (otherUser) {
        console.log(`Using other user: ${otherUser.name}`);
        // Create submission
        const sub = await prisma.labSubmission.create({
            data: {
                studentId: otherUser.id,
                courseId: course.id,
                labNumber: 1,
                submissionCode: "console.log('Hello World')",
                language: 'javascript'
            }
        });
        console.log(`Created mock submission: ${sub.id}`);

        // 2. Test Get Candidate
        console.log("Fetching candidate...");
        // We must mock auth context if we were running raw function, but since 'actions' use auth(), 
        // we can't easily run them in CLI script without mocking 'auth()'.
        // ACTIONS which depend on 'auth()' usually fail in CLI scripts unless we mock or the script runs in Next env.
        // Simulating logic directly here for verification of DB queries at least:

        const candidate = await prisma.labSubmission.findFirst({
            where: {
                courseId: course.id,
                studentId: { not: user.id },
                peerReviews: { none: { reviewerId: user.id } }
            }
        });
        console.log("Candidate found via query:", candidate ? "YES" : "NO");

        if (candidate) {
            // 3. Submit Review (Simulated)
            const review = await prisma.peerReview.create({
                data: {
                    submissionId: candidate.id,
                    reviewerId: user.id,
                    rating: 5,
                    feedback: "Great work!"
                }
            });
            console.log("Review submitted:", review.id);
        }

    } else {
        console.log("Need at least 2 users for peer review test.");
    }

    console.log("Verification checks complete (Simulation).");
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect())
