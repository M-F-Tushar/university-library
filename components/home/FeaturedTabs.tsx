"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { ResourceCard } from "@/components/resources/ResourceCard"; // Assuming we reuse this

// Mock Data
const trendingResources = [
    { id: "1", title: "CSE-220 Mid Term 2023 Solution", description: "Complete solution with explanations", category: "Past Questions", type: "Question", department: "CSE-220", format: "PDF", author: "Dr. A. Rahman", createdAt: new Date(Date.now() - 86400000 * 2) },
    { id: "2", title: "Introduction to Algorithms - Cormen", description: "The standard textbook", category: "Books", type: "Book", department: "CSE-221", format: "PDF", author: "Faculty", createdAt: new Date(Date.now() - 86400000 * 7) },
    { id: "3", title: "Lecture 5: Pointers in C++", description: "Detailed slides on pointers", category: "Notes", type: "Notes", department: "CSE-111", format: "PPTX", author: "Lecturer B", createdAt: new Date(Date.now() - 86400000 * 3) },
];

const examResources = [
    { id: "4", title: "CSE-110 Final Exam Spring 2023", description: "Spring 23 Final Question", category: "Past Questions", type: "Question", department: "CSE-110", format: "PDF", author: "Admin", createdAt: new Date(Date.now() - 86400000 * 60) },
    { id: "5", title: "CSE-321 Mid Term Fall 2023", description: "Fall 23 Mid Term", category: "Past Questions", type: "Question", department: "CSE-321", format: "PDF", author: "Admin", createdAt: new Date(Date.now() - 86400000 * 45) },
];

const newUploads = [
    { id: "6", title: "Lab Manual 4: Networking", description: "Packet Tracer manual", category: "Labs", type: "Lab", department: "CSE-320", format: "PDF", author: "Lab Instructor", createdAt: new Date(Date.now() - 3600000 * 5) },
    { id: "7", title: "Project Proposal Guidelines", description: "Final year project guide", category: "Projects", type: "Project", department: "CSE-400", format: "DOCX", author: "Committee", createdAt: new Date(Date.now() - 86400000 * 1) },
];

export function FeaturedTabs() {
    return (
        <section className="py-16 bg-gray-50 dark:bg-gray-800/30">
            <div className="container mx-auto px-4">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Discover Resources</h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">Curated collections to help you study better</p>
                </div>

                <Tabs defaultValue="trending" className="w-full max-w-4xl mx-auto">
                    <TabsList className="grid w-full grid-cols-3 mb-8 bg-white dark:bg-gray-800 p-1 rounded-xl shadow-sm">
                        <TabsTrigger value="trending" className="data-[state=active]:bg-primary-100 data-[state=active]:text-primary-700 rounded-lg">🔥 Trending</TabsTrigger>
                        <TabsTrigger value="exam" className="data-[state=active]:bg-teal-100 data-[state=active]:text-teal-700 rounded-lg">📝 Exam Ready</TabsTrigger>
                        <TabsTrigger value="new" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 rounded-lg">✨ New Uploads</TabsTrigger>
                    </TabsList>

                    <TabsContent value="trending" className="space-y-4">
                        {trendingResources.map(res => <ResourceCard key={res.id} resource={res} variant="list" />)}
                        <div className="text-center mt-4">
                            <a href="/resources?sort=popular" className="text-sm font-medium text-primary-600 hover:underline">View all trending</a>
                        </div>
                    </TabsContent>

                    <TabsContent value="exam" className="space-y-4">
                        {examResources.map(res => <ResourceCard key={res.id} resource={res} variant="list" />)}
                        <div className="text-center mt-4">
                            <a href="/resources?category=Questions" className="text-sm font-medium text-teal-600 hover:underline">View all exam papers</a>
                        </div>
                    </TabsContent>

                    <TabsContent value="new" className="space-y-4">
                        {newUploads.map(res => <ResourceCard key={res.id} resource={res} variant="list" />)}
                        <div className="text-center mt-4">
                            <a href="/resources?sort=newest" className="text-sm font-medium text-blue-600 hover:underline">View all new uploads</a>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </section>
    );
}
