import type { Metadata } from "next";
import { UserSidebar } from "@/components/navigation/UserSidebar";

export const metadata: Metadata = {
    title: "Dashboard - University Library",
    description: "Manage your resources and settings",
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
            <UserSidebar />
            <div className="flex-1 flex flex-col">
                <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
