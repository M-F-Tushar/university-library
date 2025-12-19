import { PrismaClient } from '@prisma/client'
import { checkAndAwardBadges, getLeaderboard } from '../lib/gamification/actions'

const prisma = new PrismaClient()

async function main() {
    console.log("Starting Gamification Verification...");

    // 1. Get a user
    const user = await prisma.user.findFirst();
    if (!user) {
        console.log("No user found.");
        return;
    }
    console.log(`Testing with user: ${user.name} (${user.id})`);

    // 2. Simulate activity for Badge (Contributor: 5 uploads)
    console.log("Simulating 5 uploads...");
    // Create dummy resources if needed, but for now we might just check what happens
    // Or we force create them
    const course = await prisma.course.findFirst();
    if (course) {
        for (let i = 0; i < 5; i++) {
            // Check if already has enough uploads?
            const count = await prisma.resource.count({ where: { uploadedById: user.id } });
            if (count < 5) {
                await prisma.resource.create({
                    data: {
                        title: `Test Resource ${i}`,
                        resourceType: 'Notes',
                        fileUrl: 'http://example.com',
                        uploadedById: user.id,
                        courseId: course.id
                    }
                })
            }
        }
    }

    // 3. Test checkAndAwardBadges
    console.log("Checking badges...");
    const newBadges = await checkAndAwardBadges(user.id);
    console.log("New Badges Awarded:", newBadges);

    // 4. Verify Badge in DB
    const updatedUser = await prisma.user.findUnique({
        where: { id: user.id },
        include: { badges: true }
    });
    console.log("User Badges:", updatedUser?.badges.map(b => b.name));

    // 5. Test Leaderboard
    console.log("Fetching Leaderboard...");
    const leaderboard = await getLeaderboard();
    console.log("Top User:", leaderboard[0]?.name, "Score:", leaderboard[0]?.score);

    if (leaderboard.length > 0 && updatedUser?.badges.some(b => b.name === 'Contributor')) {
        console.log("Verification SUCCESS");
    } else {
        console.log("Verification PARTIAL/FAILED - Check logs");
    }
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect())
