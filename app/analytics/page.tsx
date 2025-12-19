'use client';

import { useEffect, useState } from 'react';
import { getStudentAnalytics } from '@/lib/analytics/student-actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import { BookOpen, Clock, TrendingUp } from 'lucide-react';

interface AnalyticsData {
    activityData: { date: string; interactions: number; hours: number }[];
    readingDistribution: { name: string; value: number; color: string }[];
    gradeData: { course: string; grade: number }[];
    totalInteractions: number;
}

const COLORS = ['#94a3b8', '#3b82f6', '#22c55e'];

export default function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const analytics = await getStudentAnalytics();
                setData(analytics);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            </div>
        );
    }

    if (!data) {
        return <div className="p-8">Please sign in to view analytics.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20 pt-24 dark:bg-black">
            <div className="container mx-auto px-4 space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Analytics</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Track your study habits and academic progress.
                    </p>
                </div>

                {/* KPI Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="dark:bg-gray-900 border-none shadow-sm ring-1 ring-gray-200 dark:ring-gray-800">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Study Sessions (7d)</CardTitle>
                            <Clock className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{data.totalInteractions}</div>
                            <p className="text-xs text-gray-500">Interactions this week</p>
                        </CardContent>
                    </Card>
                    <Card className="dark:bg-gray-900 border-none shadow-sm ring-1 ring-gray-200 dark:ring-gray-800">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Resources Completed</CardTitle>
                            <BookOpen className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {data.readingDistribution?.find(d => d.name === 'Completed')?.value || 0}
                            </div>
                            <p className="text-xs text-gray-500">Books/Materials finished</p>
                        </CardContent>
                    </Card>
                    <Card className="dark:bg-gray-900 border-none shadow-sm ring-1 ring-gray-200 dark:ring-gray-800">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Grade Average</CardTitle>
                            <TrendingUp className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {data.gradeData?.length > 0
                                    ? (data.gradeData.reduce((acc: number, curr: any) => acc + curr.grade, 0) / data.gradeData.length).toFixed(2)
                                    : 'N/A'}
                            </div>
                            <p className="text-xs text-gray-500">Based on recorded grades</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                    {/* Activity Chart */}
                    <Card className="col-span-1 dark:bg-gray-900 border-none shadow-sm ring-1 ring-gray-200 dark:ring-gray-800">
                        <CardHeader>
                            <CardTitle>Daily Study Activity</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.activityData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                                    <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1f2937', color: '#fff', borderRadius: '8px', border: 'none' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Bar dataKey="interactions" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Reading Progress Pie */}
                    <Card className="col-span-1 dark:bg-gray-900 border-none shadow-sm ring-1 ring-gray-200 dark:ring-gray-800">
                        <CardHeader>
                            <CardTitle>Reading Progress</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data.readingDistribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {data.readingDistribution?.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
