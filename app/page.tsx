import { CseHero } from "@/components/home/CseHero";
import { NoticeBanner } from "@/components/home/NoticeBanner";
import { ExamShortcuts } from "@/components/home/ExamShortcuts";
import { CourseQuickGrid } from "@/components/home/CourseQuickGrid";
import { FeaturedTabs } from "@/components/home/FeaturedTabs";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <NoticeBanner />
      <CseHero />
      <ExamShortcuts />
      <CourseQuickGrid />
      <FeaturedTabs />
    </div>
  );
}
