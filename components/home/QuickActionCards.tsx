"use client";

import Link from "next/link";
import { Upload, BookOpen, Headset, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";

const ACTIONS = [
    {
        title: "Upload Resource",
        description: "Share notes or papers",
        icon: Upload,
        link: "/upload",
        primary: true
    },
    {
        title: "Request Resource",
        description: "Can't find something?",
        icon: BookOpen,
        link: "/request"
    },
    {
        title: "Help & Support",
        description: "User guides & FAQs",
        icon: Headset,
        link: "/help"
    },
    {
        title: "Feedback",
        description: "Report issues",
        icon: MessageSquare,
        link: "/feedback"
    }
];

export function QuickActionCards() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            {ACTIONS.map((action) => (
                <div
                    key={action.title}
                    className="flex flex-col p-5 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-md ${action.primary ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'} dark:bg-gray-700 dark:text-gray-300`}>
                            <action.icon size={20} />
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white">{action.title}</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-4 dark:text-gray-400">{action.description}</p>
                    <div className="mt-auto">
                        <Link href={action.link} className="w-full">
                            <Button variant={action.primary ? "primary" : "outline"} size="sm" fullWidth>
                                Go
                            </Button>
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
}
