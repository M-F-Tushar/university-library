
import { PrismaClient } from '@prisma/client'
import Link from 'next/link'
import { BookOpen, Search, Filter } from 'lucide-react'
import CourseCard from '@/components/courses/CourseCard'

const prisma = new PrismaClient()

// Group courses by Year-Semester key
type GroupedCourses = Record<string, any[]>

async function getCourses() {
    const courses = await prisma.course.findMany({
        orderBy: [
            { year: 'asc' },
            { semester: 'asc' },
            { courseCode: 'asc' }
        ],
        include: {
            _count: {
                select: { resources: true }
            }
        }
    })

    const grouped: GroupedCourses = {}

    courses.forEach(course => {
        const key = `Year ${course.year}, Semester ${course.semester % 2 === 0 ? 2 : 1}`
        // Logic: Semester 1, 2 -> Year 1. Semester 3, 4 -> Year 2. 
        // Actually our DB stores semester 1-8. 
        // CSTU Format: Year 1 Sem 1, Year 1 Sem 2.
        // Let's use the explicit fields from DB if we trusted them. 
        // Prompt said: Semester 1 (18.75 credits)... Semester 8.
        // DB has `year` (1-4) and `semester` (1-8).

        // Let's just group by "Year X - Semester Y"
        // Calculate semester within year: if sem 1/2 -> 1/2. if 3/4 -> 1/2.
        const semInYear = (course.semester - 1) % 2 + 1
        const groupKey = `Year ${course.year} - Semester ${semInYear}`

        if (!grouped[groupKey]) {
            grouped[groupKey] = []
        }
        grouped[groupKey].push(course)
    })

    return grouped
}

export default async function CoursesPage() {
    const groupedCourses = await getCourses()
    const groups = Object.keys(groupedCourses)

    return (
        <div className="min-h-screen bg-gray-50 pb-20 pt-24 dark:bg-black">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-10 flex flex-col items-center justify-between gap-4 md:flex-row">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            CSTU CSE Curriculum
                        </h1>
                        <p className="mt-2 text-gray-500 dark:text-gray-400">
                            Browse all expected courses for the 4-year B.Sc program.
                        </p>
                    </div>

                    <div className="flex w-full items-center gap-2 md:w-auto">
                        {/* Search Placeholder */}
                        <div className="relative flex-1 md:w-80">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by code or title..."
                                className="h-10 w-full rounded-full border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-blue-500 hover:border-blue-700 hover:border-opacity-50 dark:border-gray-800 dark:bg-gray-900 dark:focus:border-blue-500"
                            />
                        </div>
                        <button className="flex h-10 items-center gap-2 rounded-full border border-gray-200 bg-white px-4 text-sm font-medium hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800">
                            <Filter className="h-4 w-4" />
                            Filter
                        </button>
                    </div>
                </div>

                {/* Course Grid by Semester */}
                <div className="space-y-12">
                    {groups.map((group) => (
                        <section key={group} className="scroll-mt-24" id={group.replace(/\s+/g, '-').toLowerCase()}>
                            <div className="mb-6 flex items-center gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-500/30">
                                    <span className="font-bold">{group.split(' ')[1]}</span>
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {group}
                                </h2>
                                <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800"></div>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {groupedCourses[group].map((course) => (
                                    <CourseCard key={course.id} course={course} />
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    )
}
