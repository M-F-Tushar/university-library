import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"
import { BookOpenIcon, ChevronRightIcon } from "@heroicons/react/24/outline"

interface Course {
    id: string
    courseCode: string
    courseTitle: string
    credits: number
    _count?: {
        resources: number
    }
}

export function EnrolledCourses({ courses, semesterInfo }: { courses: Course[], semesterInfo: { currentSemester: number, currentYear: number } }) {
    if (!courses || courses.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Enrolled Courses</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-6 text-gray-500">
                        <p>No active courses found for Year {semesterInfo.currentYear}, Semester {semesterInfo.currentSemester}.</p>
                        <Link href="/courses" className="text-primary-600 hover:underline text-sm mt-2 inline-block">
                            Browse Curriculum
                        </Link>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-bold">
                    Year {semesterInfo.currentYear} • Semester {semesterInfo.currentSemester}
                </CardTitle>
                <Link href="/courses" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
                    View All
                </Link>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {courses.map((course) => (
                        <Link
                            key={course.id}
                            href={`/courses/${course.id}`}
                            className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-xs">
                                    {course.courseCode.split(' ')[1] || 'Code'}
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary-600 transition-colors line-clamp-1">
                                        {course.courseTitle}
                                    </h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {course.credits} Credits • {course._count?.resources || 0} Resources
                                    </p>
                                </div>
                            </div>
                            <ChevronRightIcon className="h-4 w-4 text-gray-300 group-hover:text-gray-500" />
                        </Link>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
