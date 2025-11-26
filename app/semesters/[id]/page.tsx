import { notFound } from 'next/navigation';
import Link from 'next/link';
import { semestersData } from '../data';
import { BookOpenIcon, ArrowLeftIcon, AcademicCapIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import PageComments from '@/app/ui/page-comments';

export default async function SemesterPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const semester = semestersData[id];

    if (!semester) {
        notFound();
    }

    const [comments, session] = await Promise.all([
        prisma.pageComment.findMany({
            where: { pageUrl: `/semesters/${id}`, isApproved: true },
            orderBy: { createdAt: 'desc' },
            select: { id: true, userName: true, comment: true, createdAt: true },
        }),
        auth(),
    ]);

    const userSession = session?.user ? { name: session.user.name!, email: session.user.email! } : null;

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-black p-6 md:p-12">
            <div className="max-w-5xl mx-auto">
                <Link
                    href="/semesters"
                    className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 mb-8 transition-colors"
                >
                    <ArrowLeftIcon className="w-4 h-4 mr-1" />
                    Back to Semesters
                </Link>

                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden mb-8">
                    <div className="bg-gradient-to-r from-blue-600 to-violet-600 p-8 text-white">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                                <AcademicCapIcon className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">{semester.title}</h1>
                                <p className="text-blue-100 text-lg">{semester.description}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Syllabus & Subjects</h2>
                            <Link
                                href={`/resources?semester=${semester.id}`}
                                className="inline-flex items-center px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                                <BookOpenIcon className="w-5 h-5 mr-2" />
                                Browse {semester.id} Sem Resources
                            </Link>
                        </div>

                        <div className="grid gap-6">
                            {semester.subjects.map((subject) => (
                                <div
                                    key={subject.code}
                                    className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 transition-colors"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <span className="inline-block px-2 py-1 rounded text-xs font-mono font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 mb-2">
                                                {subject.code}
                                            </span>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                                {subject.title}
                                            </h3>
                                        </div>
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700">
                                            {subject.credits} Credits
                                        </span>
                                    </div>

                                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                                        {subject.description}
                                    </p>

                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Key Topics:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {subject.topics.map((topic) => (
                                                <span
                                                    key={topic}
                                                    className="inline-flex items-center text-xs text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded border border-gray-200 dark:border-gray-700"
                                                >
                                                    <CheckCircleIcon className="w-3 h-3 mr-1 text-green-500" />
                                                    {topic}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Comments Section */}
                <PageComments
                    pageUrl={`/semesters/${id}`}
                    comments={comments}
                    userSession={userSession}
                />
            </div>
        </main>
    );
}
