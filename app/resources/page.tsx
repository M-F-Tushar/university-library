import prisma from '@/lib/prisma';
import Link from 'next/link';
import { FunnelIcon, BookOpenIcon, AcademicCapIcon, DocumentTextIcon, PresentationChartBarIcon, TagIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Pagination from '@/app/ui/pagination';
import SearchWithSuggestions from '@/app/ui/search-with-suggestions';
import { auth } from '@/auth';
import PageComments from '@/app/ui/page-comments';

export default async function ResourcesPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const resolvedSearchParams = await searchParams;
    const search = typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : undefined;
    const category = typeof resolvedSearchParams.category === 'string' ? resolvedSearchParams.category : undefined;
    const department = typeof resolvedSearchParams.department === 'string' ? resolvedSearchParams.department : undefined;
    const semester = typeof resolvedSearchParams.semester === 'string' ? resolvedSearchParams.semester : undefined;
    const year = typeof resolvedSearchParams.year === 'string' ? Number(resolvedSearchParams.year) : undefined;
    const format = typeof resolvedSearchParams.format === 'string' ? resolvedSearchParams.format : undefined;
    const currentPage = Number(resolvedSearchParams.page) || 1;

    const ITEMS_PER_PAGE = 9;
    const skip = (currentPage - 1) * ITEMS_PER_PAGE;

    const where: any = {};
    if (search) {
        where.OR = [
            { title: { contains: search } },
            { description: { contains: search } },
            { author: { contains: search } },
            { course: { contains: search } },
            { tags: { contains: search } },
        ];
    }
    if (category) where.category = category;
    if (department) where.department = department;
    if (semester) where.semester = semester;
    if (year) where.year = year;
    if (format) where.format = format;

    const [resources, totalResources, comments, session] = await Promise.all([
        prisma.resource.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: ITEMS_PER_PAGE,
            skip,
        }),
        prisma.resource.count({ where }),
        prisma.pageComment.findMany({
            where: { pageUrl: '/resources', isApproved: true },
            orderBy: { createdAt: 'desc' },
            select: { id: true, userName: true, comment: true, createdAt: true },
        }),
        auth(),
    ]);

    const totalPages = Math.ceil(totalResources / ITEMS_PER_PAGE);

    // Fetch dynamic data from database
    const [categoriesData, formatsData, semestersData] = await Promise.all([
        prisma.category.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }),
        prisma.format.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }),
        prisma.semester.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }),
    ]);

    const categories = categoriesData.map(c => c.name);
    const formats = formatsData.map(f => f.name);
    const semesters = semestersData.map(s => s.value);
    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

    const topics = [
        { name: 'Programming', query: 'programming' },
        { name: 'Data Science & AI', query: 'ai' },
        { name: 'Networking', query: 'networking' },
        { name: 'Software Eng', query: 'software engineering' },
        { name: 'Math', query: 'math' },
    ];

    // Build dynamic category colors and icons from database
    const categoryColors: Record<string, string> = {};
    const categoryIcons: Record<string, any> = {};

    categoriesData.forEach(cat => {
        categoryColors[cat.name] = cat.color;
        // Map icon names to actual icon components
        const iconMap: Record<string, any> = {
            'BookOpenIcon': BookOpenIcon,
            'DocumentTextIcon': DocumentTextIcon,
            'AcademicCapIcon': AcademicCapIcon,
            'PresentationChartBarIcon': PresentationChartBarIcon,
        };
        categoryIcons[cat.name] = iconMap[cat.icon] || BookOpenIcon;
    });

    // Fallback for any category not in database
    categoryColors['Others'] = 'bg-gray-100 text-gray-800 border-gray-200';

    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black p-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent mb-2">
                    Browse Resources
                </h1>
                <p className="text-gray-600 dark:text-gray-400">Discover and access academic materials, books, and papers.</p>
            </div>

            {/* Quick Topic Filters */}
            <div className="mb-6 flex flex-wrap gap-2">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 self-center mr-2">Popular Topics:</span>
                {topics.map((topic) => (
                    <Link
                        key={topic.name}
                        href={`/resources?search=${topic.query}`}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                        <TagIcon className="w-3 h-3 mr-1.5" />
                        {topic.name}
                    </Link>
                ))}
            </div>

            <div className="mb-8 flex flex-col gap-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <form className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row gap-3">
                        <SearchWithSuggestions />

                        <button
                            type="submit"
                            className="rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-2.5 text-white font-medium hover:from-blue-700 hover:to-violet-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 whitespace-nowrap"
                        >
                            Search
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="relative">
                            <select
                                name="category"
                                defaultValue={category}
                                className="w-full appearance-none rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 border pl-3 pr-8 py-2 text-sm transition-all"
                            >
                                <option value="">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <FunnelIcon className="absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                        <div className="relative">
                            <select
                                name="semester"
                                defaultValue={semester}
                                className="w-full appearance-none rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 border pl-3 pr-8 py-2 text-sm transition-all"
                            >
                                <option value="">All Semesters</option>
                                {semesters.map((sem) => (
                                    <option key={sem} value={sem}>{sem} Sem</option>
                                ))}
                            </select>
                            <FunnelIcon className="absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                        <div className="relative">
                            <select
                                name="format"
                                defaultValue={format}
                                className="w-full appearance-none rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 border pl-3 pr-8 py-2 text-sm transition-all"
                            >
                                <option value="">All Formats</option>
                                {formats.map((fmt) => (
                                    <option key={fmt} value={fmt}>{fmt}</option>
                                ))}
                            </select>
                            <FunnelIcon className="absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                        <div className="relative">
                            <select
                                name="year"
                                defaultValue={year}
                                className="w-full appearance-none rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 border pl-3 pr-8 py-2 text-sm transition-all"
                            >
                                <option value="">All Years</option>
                                {years.map((y) => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                            <FunnelIcon className="absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </form>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {resources.map((resource) => {
                    const Icon = categoryIcons[resource.category] || BookOpenIcon;
                    return (
                        <Link
                            key={resource.id}
                            href={`/resources/${resource.id}`}
                            className="group"
                        >
                            <div className="h-full overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 flex flex-col">
                                {resource.coverImage ? (
                                    <div className="h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-900 relative">
                                        <img
                                            src={resource.coverImage}
                                            alt={resource.title}
                                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-2 right-2">
                                            <span className={`inline-flex items-center rounded-lg border px-3 py-1 text-xs font-semibold shadow-sm ${categoryColors[resource.category] || categoryColors['Others']}`}>
                                                {resource.category}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-48 w-full bg-gradient-to-br from-blue-50 to-violet-50 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center relative">
                                        <Icon className="h-16 w-16 text-blue-200 dark:text-gray-600" />
                                        <div className="absolute top-2 right-2">
                                            <span className={`inline-flex items-center rounded-lg border px-3 py-1 text-xs font-semibold shadow-sm ${categoryColors[resource.category] || categoryColors['Others']}`}>
                                                {resource.category}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-start justify-between mb-2">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {resource.year ? resource.year : new Date(resource.createdAt).getFullYear()}
                                        </span>
                                        {resource.format && (
                                            <span className="text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded">
                                                {resource.format}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-1" title={resource.title}>
                                        {resource.title}
                                    </h3>

                                    {resource.author && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 italic">
                                            by {resource.author}
                                        </p>
                                    )}

                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4 flex-1">
                                        {resource.description}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
                                        <div className="flex gap-2">
                                            {resource.course && (
                                                <span className="inline-flex items-center text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded-md">
                                                    {resource.course}
                                                </span>
                                            )}
                                            {resource.semester && (
                                                <span className="inline-flex items-center text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded-md">
                                                    {resource.semester} Sem
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {resources.length === 0 ? (
                <div className="text-center py-16">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                        <MagnifyingGlassIcon className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-lg font-medium text-gray-900 dark:text-white mb-1">No resources found</p>
                    <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filters</p>
                </div>
            ) : (
                <div className="mt-8 flex w-full justify-center">
                    <Pagination totalPages={totalPages} />
                </div>
            )}

            {/* Comments Section */}
            <div className="mt-12">
                <PageComments
                    pageUrl="/resources"
                    comments={comments}
                    userSession={session?.user ? { name: session.user.name!, email: session.user.email! } : null}
                />
            </div>
        </main>
    );
}
