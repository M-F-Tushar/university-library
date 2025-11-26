import Link from 'next/link';
import { BookOpenIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import PageComments from '@/app/ui/page-comments';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CoursesPage() {
    const [courses, comments, session] = await Promise.all([
        prisma.course.findMany({
            where: { isActive: true },
            orderBy: [{ department: 'asc' }, { order: 'asc' }],
        }),
        prisma.pageComment.findMany({
            where: { pageUrl: '/courses', isApproved: true },
            orderBy: { createdAt: 'desc' },
            select: { id: true, userName: true, comment: true, createdAt: true },
        }),
        auth(),
    ]);

    // Group by department
    const coursesByDept = courses.reduce((acc: any, course: any) => {
        const dept = course.department || 'Other';
        if (!acc[dept]) acc[dept] = [];
        acc[dept].push(course);
        return acc;
    }, {} as Record<string, typeof courses>);

    const userSession = session?.user ? { name: session.user.name!, email: session.user.email! } : null;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent sm:text-5xl">
                        Courses
                    </h1>
                    <p className="mt-4 text-xl text-gray-600">
                        Browse courses by department and semester
                    </p>
                </div>

                {/* Courses Grid */}
                <div className="space-y-8 mb-12">
                    {Object.entries(coursesByDept).map(([dept, deptCourses]) => (
                        <div key={dept} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-50 to-violet-50 px-6 py-4 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-900">{dept}</h2>
                            </div>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {(deptCourses as any[]).map((course: any, idx: number) => (
                                    <Link
                                        key={idx}
                                        href={`/resources?course=${encodeURIComponent(course.code)}`}
                                        className="group p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 shadow-md group-hover:scale-110 transition-transform">
                                                <AcademicCapIcon className="h-5 w-5 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="px-2 py-0.5 text-xs font-mono font-medium bg-blue-100 text-blue-700 rounded">
                                                        {course.code}
                                                    </span>
                                                    {course.credits && (
                                                        <span className="text-xs text-gray-500">{course.credits} credits</span>
                                                    )}
                                                </div>
                                                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                    {course.name}
                                                </h3>
                                                {course.semester && (
                                                    <p className="text-sm text-gray-500 mt-1">{course.semester} Semester</p>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {courses.length === 0 && (
                    <div className="text-center py-12">
                        <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-semibold text-gray-900">No courses found</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by adding some course materials.</p>
                    </div>
                )}

                {/* Comments Section */}
                <PageComments
                    pageUrl="/courses"
                    comments={comments}
                    userSession={userSession}
                />
            </div>
        </div>
    );
}
