import { BookOpen, Home, LayoutDashboard, Library, Trophy, Users } from "lucide-react";

export const mainNavigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Courses", href: "/courses", icon: BookOpen },
    { name: "Resources", href: "/resources", icon: Library },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Community", href: "/leaderboard", icon: Users }, // Leaderboard/Forum entry
];

export const userNavigation = [
    { name: "Profile", href: "/profile" },
    { name: "Settings", href: "/settings" },
    { name: "Sign out", href: "#" },
];

export const dashboardNavigation = [
    { name: "Overview", href: "/dashboard" },
    { name: "My Courses", href: "/dashboard/courses" },
    { name: "Assignments", href: "/dashboard/assignments" },
    { name: "Grades", href: "/dashboard/grades" },
];
