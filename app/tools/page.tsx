import Link from 'next/link';
import { Calculator, BookOpen, Code, FileText, Wrench } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const tools = [
    {
        title: 'GPA Calculator',
        description: 'Calculate your Grade Point Average using the CSTU grading scale. Add courses, select grades, and see your projected GPA.',
        href: '/tools/gpa',
        icon: Calculator,
        color: 'from-blue-500 to-cyan-500',
        available: true
    },
    {
        title: 'Prerequisite Checker',
        description: 'Check which courses you can take based on your completed prerequisites.',
        href: '#',
        icon: BookOpen,
        color: 'from-purple-500 to-pink-500',
        available: false
    },
    {
        title: 'Code Playground',
        description: 'Write and run code snippets online for practice and learning.',
        href: '#',
        icon: Code,
        color: 'from-green-500 to-emerald-500',
        available: false
    },
    {
        title: 'Resume Builder',
        description: 'Create a professional resume tailored for tech internships and jobs.',
        href: '#',
        icon: FileText,
        color: 'from-amber-500 to-orange-500',
        available: false
    },
];

export default function ToolsPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black pb-20 pt-24">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-sm font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                        <Wrench className="h-4 w-4" />
                        Student Tools
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
                        Productivity Tools
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
                        Useful tools to help you succeed in your academic journey at CSTU.
                    </p>
                </div>

                {/* Tools Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
                    {tools.map((tool) => (
                        <Link
                            key={tool.title}
                            href={tool.available ? tool.href : '#'}
                            className={`group block ${!tool.available ? 'cursor-not-allowed' : ''}`}
                        >
                            <Card className={`h-full transition-all duration-300 ${tool.available ? 'hover:shadow-lg hover:-translate-y-1' : 'opacity-60'}`}>
                                <CardContent className="p-6">
                                    <div className={`inline-flex p-3 rounded-xl mb-4 bg-gradient-to-br ${tool.color} text-white shadow-lg ${tool.available ? 'group-hover:scale-110 transition-transform' : ''}`}>
                                        <tool.icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                        {tool.title}
                                        {!tool.available && (
                                            <span className="ml-2 text-xs font-normal text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                                                Coming Soon
                                            </span>
                                        )}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {tool.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* Suggest a Tool */}
                <div className="mt-16 text-center">
                    <Card className="max-w-md mx-auto bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-100 dark:border-blue-800">
                        <CardContent className="p-6">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                                Have a tool idea?
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                We're always looking for ways to help students. Share your suggestions!
                            </p>
                            <Link
                                href="/community"
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                            >
                                Share in Community Forum
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
