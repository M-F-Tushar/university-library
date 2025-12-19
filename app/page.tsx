import { HeroSection } from "@/components/landing/HeroSection";
import { QuickActions } from "@/components/landing/QuickActions";
import { LiveStats } from "@/components/landing/LiveStats";
import { CommunityActivity } from "@/components/landing/CommunityActivity";
import { NoticeBanner } from "@/components/home/NoticeBanner";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-white dark:bg-black selection:bg-blue-100 selection:text-blue-900">
      <NoticeBanner />
      <HeroSection />
      <QuickActions />
      <CommunityActivity />
      <LiveStats />

      {/* Footer Call to Action (Simple) */}
      <section className="py-24 text-center bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 mx-auto">
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white font-display">
            Ready to excel in your studies?
          </h2>
          <p className="max-w-xl mx-auto mb-8 text-lg text-gray-600 dark:text-gray-400">
            Join your peers in the most comprehensive learning platform for CSTU Computer Science students.
          </p>
          <a href="/login" className="inline-block px-8 py-3 text-lg font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
            Get Started Now
          </a>
        </div>
      </section>
    </main>
  );
}
