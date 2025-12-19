'use client'

import { useState } from 'react'
import { Plus, Trash2, Calculator, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/Button'

type GradePoint = {
    grade: string
    point: number
}

const GRADING_SCALE: GradePoint[] = [
    { grade: 'A+', point: 4.00 },
    { grade: 'A', point: 3.75 },
    { grade: 'A-', point: 3.50 },
    { grade: 'B+', point: 3.25 },
    { grade: 'B', point: 3.00 },
    { grade: 'B-', point: 2.75 },
    { grade: 'C+', point: 2.50 },
    { grade: 'C', point: 2.25 },
    { grade: 'D', point: 2.00 },
    { grade: 'F', point: 0.00 },
]

type CourseRow = {
    id: number
    name: string
    credits: number
    gradePoint: number
}

export function GPACalculator() {
    const [courses, setCourses] = useState<CourseRow[]>([
        { id: 1, name: 'Course 1', credits: 3, gradePoint: 4.00 },
        { id: 2, name: 'Course 2', credits: 3, gradePoint: 3.75 },
        { id: 3, name: 'Course 3', credits: 1.5, gradePoint: 3.50 },
    ])

    const addCourse = () => {
        setCourses([...courses, {
            id: Date.now(),
            name: `Course ${courses.length + 1}`,
            credits: 3,
            gradePoint: 4.00
        }])
    }

    const removeCourse = (id: number) => {
        setCourses(courses.filter(c => c.id !== id))
    }

    const updateCourse = (id: number, field: keyof CourseRow, value: any) => {
        setCourses(courses.map(c => c.id === id ? { ...c, [field]: value } : c))
    }

    const calculateGPA = () => {
        const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0)
        const totalPoints = courses.reduce((sum, c) => sum + (c.credits * c.gradePoint), 0)
        return totalCredits === 0 ? 0 : (totalPoints / totalCredits)
    }

    const reset = () => {
        setCourses([{ id: 1, name: 'Course 1', credits: 3, gradePoint: 4.00 }])
    }

    const gpa = calculateGPA()

    return (
        <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Course Grades</h2>
                        <Button onClick={addCourse} variant="outline" size="sm" className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Course
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {courses.map((course) => (
                            <div key={course.id} className="flex flex-col gap-3 rounded-lg border border-gray-100 bg-gray-50/50 p-3 dark:border-gray-800 dark:bg-gray-800/50 sm:flex-row sm:items-center">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        placeholder="Course Name"
                                        className="w-full rounded-md border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                                        value={course.name}
                                        onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-24">
                                        <select
                                            className="w-full rounded-md border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                                            value={course.credits}
                                            onChange={(e) => updateCourse(course.id, 'credits', parseFloat(e.target.value))}
                                        >
                                            <option value={0.75}>0.75 Cr</option>
                                            <option value={1.0}>1.0 Cr</option>
                                            <option value={1.5}>1.5 Cr</option>
                                            <option value={2.0}>2.0 Cr</option>
                                            <option value={3.0}>3.0 Cr</option>
                                            <option value={4.0}>4.0 Cr</option>
                                        </select>
                                    </div>
                                    <div className="w-32">
                                        <select
                                            className="w-full rounded-md border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                                            value={course.gradePoint}
                                            onChange={(e) => updateCourse(course.id, 'gradePoint', parseFloat(e.target.value))}
                                        >
                                            {GRADING_SCALE.map((g) => (
                                                <option key={g.grade} value={g.point}>
                                                    {g.grade} ({g.point})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <button
                                        onClick={() => removeCourse(course.id)}
                                        className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="lg:col-span-1">
                <div className="sticky top-24 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                        <Calculator className="h-5 w-5 text-blue-600" />
                        Result
                    </h2>

                    <div className="flex flex-col items-center justify-center rounded-lg bg-blue-50 py-8 dark:bg-blue-900/10">
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Your GPA</span>
                        <span className="text-5xl font-bold text-gray-900 dark:text-white">{gpa.toFixed(2)}</span>
                    </div>

                    <div className="mt-6 space-y-4">
                        <div className="flex justify-between border-b border-gray-100 pb-2 dark:border-gray-800">
                            <span className="text-sm text-gray-500">Total Credits</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                                {courses.reduce((sum, c) => sum + c.credits, 0)}
                            </span>
                        </div>
                        <div className="flex justify-between border-b border-gray-100 pb-2 dark:border-gray-800">
                            <span className="text-sm text-gray-500">Total Points</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                                {courses.reduce((sum, c) => sum + (c.credits * c.gradePoint), 0).toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <Button onClick={reset} variant="ghost" className="mt-6 w-full gap-2 text-gray-500">
                        <RotateCcw className="h-4 w-4" />
                        Reset Calculator
                    </Button>
                </div>
            </div>
        </div>
    )
}
