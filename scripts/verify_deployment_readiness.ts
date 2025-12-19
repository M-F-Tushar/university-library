import { execSync } from 'child_process';

const SCRIPTS = [
    'scripts/verify_past_papers.ts',
    'scripts/verify_recommendations.ts',
    'scripts/verify_analytics.ts',
    'scripts/verify_gamification.ts',
    'scripts/verify_reviews.ts'
];

console.log("🚀 Starting Full System Verification...");
console.log("=========================================");

let passed = 0;
let failed = 0;

for (const script of SCRIPTS) {
    console.log(`\nTesting: ${script}`);
    try {
        const output = execSync(`npx tsx ${script}`, { stdio: 'pipe' }).toString();
        // Check for specific success markers or just absence of error code
        // Most scripts logged "Verification SUCCESS" or similar
        console.log("✅ PASS");
        // console.log(output.trim()); // Optional: show output
        passed++;
    } catch (e: any) {
        console.log("❌ FAIL");
        console.error(e.stdout?.toString() || e.message);
        failed++;
    }
}

console.log("\n=========================================");
console.log(`SUMMARY: ${passed} Passed, ${failed} Failed`);

if (failed === 0) {
    console.log("✨ SYSTEM READY FOR DEPLOYMENT ✨");
    process.exit(0);
} else {
    console.log("⚠️ ISSUES DETECTED");
    process.exit(1);
}
