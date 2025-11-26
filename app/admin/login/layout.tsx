import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin Portal - University Library",
    description: "Administrative control panel",
};

export default function AdminLoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
