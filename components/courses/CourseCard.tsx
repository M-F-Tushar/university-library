
import Link from 'next/link'
import { BookOpen, Users, FileText } from 'lucide-react'
import { Course } from '@prisma/client'

// Extended type to include count
type CourseWithCount = Course & {
    _count?: {
        resources: number
        discussions?: number
    }
}

interface CourseCardProps {
    course: CourseWithCount
}

export default function CourseCard({ course }: CourseCardProps) {
    return (
        <Link
            href={`/courses/${course.courseCode}`}
            className="group flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-blue-500 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-500"
        >
            <div>
                <div className="flex items-start justify-between">
                    <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                        {course.courseCode}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        {course.credits} Cr
                    </span>
                </div>

                <h3 className="mt-3 text-lg font-bold text-gray-900 group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
                    {course.courseTitle}
                </h3>

                {course.description && (
                    <p className="mt-2 text-sm text-gray-500 line-clamp-2 dark:text-gray-400">
                        {course.description}
                    </p>
                )}
            </div>

            <div className="mt-4 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5" />
                    <span>{course._count?.resources || 0} Resources</span>
                </div>
                {(course.isTheory && !course.isSessional) && (
                    <div className="flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>Theory</span>
                    </div>
                )}
                {course.isSessional && (
                    <div className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        <span>Lab</span>
                    </div>
                )}
            </div>
        </Link>
    )
}
