import { BookOpenIcon, AcademicCapIcon, UserGroupIcon, SparklesIcon } from '@heroicons/react/24/outline';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import PageComments from '@/app/ui/page-comments';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AboutPage() {
    const [totalResources, totalUsers, siteName, siteDescription, comments, session] = await Promise.all([
        prisma.resource.count(),
        prisma.user.count(),
        prisma.siteSettings.findUnique({ where: { key: 'site_name' } }),
        prisma.siteSettings.findUnique({ where: { key: 'site_description' } }),
        prisma.pageComment.findMany({
            where: { pageUrl: '/about', isApproved: true },
            orderBy: { createdAt: 'desc' },
            select: { id: true, userName: true, comment: true, createdAt: true },
        }),
        auth(),
    ]);

    const stats = [
        { label: 'Resources', value: totalResources.toString(), icon: BookOpenIcon },
        { label: 'Students', value: totalUsers.toString(), icon: UserGroupIcon },
        { label: 'Categories', value: '4+', icon: AcademicCapIcon },
        { label: 'Always Available', value: '24/7', icon: SparklesIcon },
    ];

    const userSession = session?.user ? { name: session.user.name!, email: session.user.email! } : null;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-violet-600 text-white py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl">
                            About {siteName?.value || 'Our Library'}
                        </h1>
                        <p className="mt-6 text-xl text-blue-100 max-w-3xl mx-auto">
                            {siteDescription?.value || 'Your dedicated digital library for Computer Science resources'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="py-12 bg-white border-b border-gray-200">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat) => (
                            <div key={stat.label} className="text-center">
                                <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg mb-3">
                                    <stat.icon className="h-6 w-6 text-white" />
                                </div>
                                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                                <div className="text-sm text-gray-600">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mission Section */}
            <div className="py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                            <div className="prose prose-lg text-gray-600">
                                <p>
                                    We are dedicated to providing Computer Science students with easy access to high-quality
                                    educational resources, including textbooks, past examination papers, lecture notes, and
                                    research materials.
                                </p>
                                <p>
                                    Our platform is built by students, for students, with the goal of making learning more
                                    accessible and collaborative.
                                </p>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-violet-50 rounded-2xl p-8 border border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">What We Offer</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center mt-0.5">
                                        <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-700">Comprehensive collection of digital textbooks and reference materials</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center mt-0.5">
                                        <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-700">Archive of past examination papers with solutions</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center mt-0.5">
                                        <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-700">Lecture notes and slides from various courses</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center mt-0.5">
                                        <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-700">Research papers and academic articles</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center mt-0.5">
                                        <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-700">24/7 access from anywhere</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-16 bg-gray-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose Us?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4">
                                <BookOpenIcon className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Curated Content</h3>
                            <p className="text-gray-600">
                                All resources are carefully selected and organized to ensure quality and relevance to your studies.
                            </p>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center mb-4">
                                <UserGroupIcon className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Driven</h3>
                            <p className="text-gray-600">
                                Built by students for students, fostering a collaborative learning environment.
                            </p>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4">
                                <SparklesIcon className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Always Updated</h3>
                            <p className="text-gray-600">
                                Regular updates with new materials and resources to keep you ahead in your studies.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Learning?</h2>
                    <p className="text-xl text-gray-600 mb-8">
                        Join our community and get access to thousands of resources
                    </p>
                    <div className="flex justify-center gap-4">
                        <a
                            href="/resources"
                            className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold hover:from-blue-700 hover:to-violet-700 transition-all shadow-md hover:shadow-lg"
                        >
                            Browse Resources
                        </a>
                        <a
                            href="/register"
                            className="inline-flex items-center px-6 py-3 rounded-lg bg-white text-blue-600 font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-all"
                        >
                            Get Started
                        </a>
                    </div>
                </div>
            </div>

            {/* Comments Section */}
            <div className="py-16 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <PageComments
                        pageUrl="/about"
                        comments={comments}
                        userSession={userSession}
                    />
                </div>
            </div>
        </div>
    );
}
