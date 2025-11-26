import Link from 'next/link';
import { AcademicCapIcon } from '@heroicons/react/24/outline';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function SemestersPage() {
    const semesters = await prisma.semester.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' },
    });

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-black p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-4">
                        Browse by Semester
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Find resources tailored to your current academic progress.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {semesters.map((sem) => (
                        <Link
                            key={sem.value}
                            href={`/semesters/${sem.value}`}
                            className="group relative bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-800 hover:-translate-y-1 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <AcademicCapIcon className="w-24 h-24 text-violet-600" />
                            </div>

                            <div className="relative z-10">
                                <span className="inline-block px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-300 text-xs font-semibold mb-4">
                                    {sem.value} Sem
                                </span>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                                    {sem.name}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {sem.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
