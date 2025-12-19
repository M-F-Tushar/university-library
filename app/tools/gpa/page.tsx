import { GPACalculator } from "@/components/tools/GPACalculator"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

export default function GPACalculatorPage() {
    return (
        <div className="min-h-screen bg-gray-50 pb-20 pt-24 dark:bg-black">
            <div className="container mx-auto px-4">
                {/* Breadcrumb */}
                <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Link href="/" className="hover:text-blue-500">Home</Link>
                    <ChevronRight className="h-4 w-4" />
                    <span className="font-medium text-gray-900 dark:text-gray-100">GPA Calculator</span>
                </nav>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">GPA Calculator</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Calculate your Grade Point Average (GPA) using the standard university grading scale.
                        Add your courses, select credits and grades to estimate your result.
                    </p>
                </div>

                <GPACalculator />
            </div>
        </div>
    )
}
