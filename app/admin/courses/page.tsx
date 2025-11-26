import { Suspense } from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export const dynamic = 'force-dynamic';

async function CoursesList() {
    const courses = await prisma.course.findMany({
        orderBy: [{ department: 'asc' }, { order: 'asc' }],
    });

    const groupedCourses = courses.reduce((acc: any, course: any) => {
        if (!acc[course.department]) {
            acc[course.department] = [];
        }
        acc[course.department].push(course);
        return acc;
    }, {});

    return (
        <div className="space-y-6">
            {Object.entries(groupedCourses).map(([department, deptCourses]: [string, any]) => (
                <div key={department} className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">{department}</h3>
                    </div>
                    <div className="p-6">
                        <div className="space-y-3">
                            {deptCourses.map((course: any) => (
                                <div key={course.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <span className="px-2 py-1 text-xs font-mono font-medium bg-blue-100 text-blue-700 rounded">
                                                {course.code}
                                            </span>
                                            <h4 className="font-semibold text-gray-900">{course.name}</h4>
                                            {!course.isActive && (
                                                <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                                                    Inactive
                                                </span>
                                            )}
                                        </div>
                                        {course.description && (
                                            <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                                        )}
                                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                            {course.semester && <span>Semester: {course.semester}</span>}
                                            <span>Credits: {course.credits}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 ml-4">
                                        <Link
                                            href={`/admin/courses/edit/${course.id}`}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <PencilIcon className="h-5 w-5" />
                                        </Link>
                                        <form action={`/api/admin/courses/${course.id}`} method="DELETE">
                                            <button
                                                type="submit"
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function CoursesManagementPage() {
    return (
        <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
                    <p className="text-gray-600 mt-1">Manage courses offered by the university</p>
                </div>
                <Link
                    href="/admin/courses/create"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <PlusIcon className="h-5 w-5" />
                    Add Course
                </Link>
            </div>

            <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
                <CoursesList />
            </Suspense>
        </div>
    );
}
