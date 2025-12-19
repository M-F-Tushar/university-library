import { Card, CardContent } from "@/components/ui/Card"
import { FireIcon } from "@heroicons/react/24/solid"

export function StudyStreak({ streak }: { streak: number }) {
    return (
        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-100 dark:border-orange-900/50">
            <CardContent className="p-6 flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-orange-800 dark:text-orange-300">Study Streak</p>
                    <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl font-bold text-orange-600 dark:text-orange-500">{streak}</span>
                        <span className="text-sm text-orange-600/80 dark:text-orange-400">days</span>
                    </div>
                    <p className="text-xs text-orange-600/60 dark:text-orange-400/60 mt-2">
                        {streak > 0 ? "Keep it up!" : "Start learning today!"}
                    </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center">
                    <FireIcon className={`h-8 w-8 ${streak > 0 ? "text-orange-500 animate-pulse" : "text-gray-300 dark:text-gray-600"}`} />
                </div>
            </CardContent>
        </Card>
    )
}
