import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import StudentUploadForm from '@/app/dashboard/upload/StudentUploadForm';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeftIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';

export default async function StudentUploadPage() {
    const session = await auth();

    if (!session?.user) {
        redirect('/login?callbackUrl=/dashboard/upload');
    }

    // Fetch courses for the dropdown
    const courses = await prisma.course.findMany({
        orderBy: [{ year: 'asc' }, { semester: 'asc' }, { courseCode: 'asc' }],
        select: {
            id: true,
            courseCode: true,
            courseTitle: true,
            year: true,
            semester: true,
        },
    });

    // Fetch categories from database
    const categories = await prisma.category.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' },
        select: { name: true },
    });

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-black pb-20 pt-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-4"
                    >
                        <ArrowLeftIcon className="h-4 w-4" />
                        Back to Dashboard
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
                            <CloudArrowUpIcon className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Submit a Resource
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400">
                                Share notes, past questions, or study materials with your peers
                            </p>
                        </div>
                    </div>
                </div>

                {/* Info Banner */}
                <div className="mb-6 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>Note:</strong> Your submission will be reviewed by an admin before it appears publicly.
                        You&apos;ll be notified once it&apos;s approved.
                    </p>
                </div>

                {/* Form */}
                <StudentUploadForm
                    courses={courses}
                    categories={categories.map(c => c.name)}
                />
            </div>
        </main>
    );
}
