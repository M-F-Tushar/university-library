import { PrismaClient } from '@prisma/client';
import { UsersIcon, BookOpenIcon, DocumentDuplicateIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

// We'll use a separate client component for the animation part if needed, 
// or just CSS animations. For simplicity and performance, pure server component rendering 
// coupled with a simple client wrapper for the number count-up is best.
// But for now, let's keep it simple: Static numbers or simple client component.
// Actually, let's make this server-side data fetching passed to a client component for animation.

import { StatsCounter } from './StatsCounter'; // We'll create this small client component

const prisma = new PrismaClient();

async function getStats() {
    const [courses, resources, users, discussions] = await Promise.all([
        prisma.course.count(),
        prisma.resource.count(),
        prisma.user.count(),
        prisma.forumDiscussion.count(),
    ]);

    return [
        { name: 'Total Courses', value: courses, icon: BookOpenIcon, color: 'text-blue-600', bg: 'bg-blue-100' },
        { name: 'Study Resources', value: resources, icon: DocumentDuplicateIcon, color: 'text-purple-600', bg: 'bg-purple-100' },
        { name: 'Active Students', value: users, icon: UsersIcon, color: 'text-emerald-600', bg: 'bg-emerald-100' },
        { name: 'Discussions', value: discussions, icon: AcademicCapIcon, color: 'text-orange-600', bg: 'bg-orange-100' },
    ];
}

export async function LiveStats() {
    const stats = await getStats();

    return (
        <section className="py-16 bg-white border-y border-gray-100 dark:bg-gray-900 dark:border-gray-800">
            <div className="container px-4 mx-auto">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                    {stats.map((stat) => (
                        <div key={stat.name} className="flex flex-col items-center text-center">
                            <div className={`flex items-center justify-center w-16 h-16 mb-4 rounded-2xl ${stat.bg} dark:bg-opacity-10`}>
                                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                            </div>
                            <StatsCounter value={stat.value} />
                            <p className="mt-2 text-sm font-medium text-gray-500 uppercase tracking-widest">
                                {stat.name}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
