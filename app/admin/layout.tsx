import type { Metadata } from "next";
import AdminSidebar from "@/app/ui/admin/sidebar";
import AdminHeader from "@/app/ui/admin/header";

export const metadata: Metadata = {
    title: "Admin Dashboard - University Library",
    description: "Administrative control panel",
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-gray-50" suppressHydrationWarning>
            <AdminSidebar />
            <div className="flex-1 flex flex-col overflow-hidden" suppressHydrationWarning>
                <AdminHeader />
                <main className="flex-1 overflow-y-auto p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
