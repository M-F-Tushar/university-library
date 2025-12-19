import prisma from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { TagIcon, MagnifyingGlassIcon, BookOpenIcon, DocumentTextIcon, AcademicCapIcon, PresentationChartBarIcon } from '@heroicons/react/24/outline';
import Pagination from '@/app/ui/pagination';
import SearchWithSuggestions from '@/app/ui/search-with-suggestions';
import { auth } from '@/auth';
import PageComments from '@/app/ui/page-comments';
import { FilterSidebar } from "@/components/search/FilterSidebar";
import { ResourceCard } from "@/components/resources/ResourceCard";

import { ViewToggle } from "@/components/resources/ViewToggle";
import { MobileFilterDrawer } from "@/components/search/MobileFilterDrawer";
import { Prisma } from '@prisma/client';

export default async function ResourcesPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const resolvedSearchParams = await searchParams;
    const search = typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : undefined;
    // Allow string or array for category to support combined filters like "Notes & Slides"
    const category = resolvedSearchParams.category;

    const department = typeof resolvedSearchParams.department === 'string' ? resolvedSearchParams.department : undefined;
    const semester = typeof resolvedSearchParams.semester === 'string' ? resolvedSearchParams.semester : undefined;
    const year = typeof resolvedSearchParams.year === 'string' ? Number(resolvedSearchParams.year) : undefined;
    const format = typeof resolvedSearchParams.format === 'string' ? resolvedSearchParams.format : undefined;
    const view = typeof resolvedSearchParams.view === 'string' && resolvedSearchParams.view === 'list' ? 'list' : 'grid';
    const currentPage = Number(resolvedSearchParams.page) || 1;

    const ITEMS_PER_PAGE = 9;
    const skip = (currentPage - 1) * ITEMS_PER_PAGE;

    const sessionParam = typeof resolvedSearchParams.session === 'string' ? resolvedSearchParams.session : undefined;
    const level = typeof resolvedSearchParams.level === 'string' ? resolvedSearchParams.level : undefined;



    const where: Prisma.ResourceWhereInput = {
        isApproved: true, // Only show approved resources to public
    };

    // Handle Session (e.g., "Spring 2024")
    if (sessionParam) {
        const [, yr] = sessionParam.split(' ');
        if (yr) where.year = parseInt(yr);
    }

    // Handle Level (e.g., "100 Level")
    if (level) {
        const levelNum = level.charAt(0); // "1", "2", etc.
        // Assumes course codes like "CSE-1xx"
        where.course = {
            courseCode: { contains: `-${levelNum}` }
        };
    }

    if (search) {
        where.OR = [
            { title: { contains: search } },
            { description: { contains: search } },
            {
                course: {
                    OR: [
                        { courseCode: { contains: search } },
                        { courseTitle: { contains: search } },
                        { department: { contains: search } }
                    ]
                }
            },
            { topics: { contains: search } },
        ];
    }

    // Handle Category (Single or Multiple)
    if (category) {
        if (Array.isArray(category)) {
            where.resourceType = { in: category };
        } else {
            where.resourceType = category;
        }
    }

    // Convert Resource filters to Course relation filters
    const courseConditions: Prisma.CourseWhereInput = {};
    if (department) courseConditions.department = department;
    if (semester) courseConditions.semester = parseInt(semester); // Assuming integer semester

    // Merge course conditions
    if (Object.keys(courseConditions).length > 0) {
        if (where.course) {
            // Use AND to safely combine existing course filters with new specific conditions
            where.course = {
                AND: [
                    where.course as Prisma.CourseWhereInput,
                    courseConditions
                ]
            };
        } else {
            where.course = courseConditions;
        }
    }

    // Note: 'format' field doesn't exist on Resource model
    // if (format) where.format = format;

    let resources: any[] = [];
    let totalResources = 0;
    let comments: any[] = [];
    let session = null;
    let categoriesData: any[] = [];
    let formatsData: any[] = [];
    let semestersData: any[] = [];

    try {
        [resources, totalResources, comments, session] = await Promise.all([
            prisma.resource.findMany({
                where,
                orderBy: { uploadedAt: 'desc' },
                take: ITEMS_PER_PAGE,
                skip,
                include: {
                    course: { select: { department: true, semester: true } }
                }
            }),
            prisma.resource.count({ where }),
            prisma.pageComment.findMany({
                where: { pageUrl: '/resources', isApproved: true },
                orderBy: { createdAt: 'desc' },
                select: { id: true, userName: true, comment: true, createdAt: true },
            }).catch(() => []),
            auth(),
        ]);
    } catch (error) {
        console.error('Error fetching resources:', error);
        // Continue with empty arrays
    }

    const totalPages = Math.ceil(totalResources / ITEMS_PER_PAGE);

    // Fetch dynamic data from database with fallbacks
    try {
        [categoriesData, formatsData, semestersData] = await Promise.all([
            prisma.category.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }).catch(() => []),
            prisma.format.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }).catch(() => []),
            prisma.semester.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }).catch(() => []),
        ]);
    } catch (error) {
        console.error('Error fetching filter data:', error);
        // Continue with empty arrays
    }

    // Provide default categories if none in database
    const defaultCategories = ['Notes', 'Questions', 'Books', 'Slides'];
    const defaultFormats = ['PDF', 'DOCX', 'ZIP'];
    const defaultSemesters = ['1', '2', '3', '4', '5', '6', '7', '8'];

    const categories = categoriesData.length > 0 ? categoriesData.map(c => c.name) : defaultCategories;
    const formats = formatsData.length > 0 ? formatsData.map(f => f.name) : defaultFormats;
    const semesters = semestersData.length > 0 ? semestersData.map(s => s.value) : defaultSemesters;
    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

    // ... (Constants: topics, categoryColors, categoryIcons) ...
    // Note: Reusing existing constants code as it is mostly display logic dependent on 'categories' array

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
    categoryColors['Notes'] = 'bg-blue-100 text-blue-800 border-blue-200';
    categoryColors['Questions'] = 'bg-purple-100 text-purple-800 border-purple-200';
    categoryColors['Books'] = 'bg-green-100 text-green-800 border-green-200';
    categoryColors['Slides'] = 'bg-amber-100 text-amber-800 border-amber-200';

    // Prepare facets for FilterSidebar
    const facets = {
        categories: categories,
        departments: ["Computer Science", "Engineering", "Mathematics", "Physics", "Business"],
        semesters: semesters,
        formats: formats,
    };

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-black pb-20 pt-8 lg:pt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section - Aligned with Courses Page */}
                <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            CSTU CSE Resources
                        </h1>
                        <p className="mt-2 text-gray-500 dark:text-gray-400">
                            Access past questions, notes, slides, and study materials for CSE courses.
                        </p>
                    </div>

                    <div className="flex w-full items-center gap-2 md:w-auto">
                        {/* View Toggle */}
                        <ViewToggle />
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar / Mobile Drawer */}
                    <aside className="hidden lg:block w-64 flex-shrink-0">
                        <div className="sticky top-24">
                            <FilterSidebar facets={facets} />
                        </div>
                    </aside>

                    {/* Mobile Filters */}
                    <MobileFilterDrawer facets={facets} />

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Search Bar */}
                        <div className="mb-6 flex gap-4">
                            <div className="flex-1">
                                <SearchWithSuggestions />
                            </div>
                            <div className="hidden sm:block">
                                <button
                                    className="h-full rounded-lg bg-primary-600 px-6 font-medium text-white hover:bg-primary-700 transition-colors shadow-sm"
                                >
                                    Search
                                </button>
                            </div>
                        </div>

                        {/* Quick Topic Filters (Pills) */}
                        <div className="mb-6 flex flex-wrap gap-2">
                            {topics.map((topic) => (
                                <Link
                                    key={topic.name}
                                    href={`/resources?search=${topic.query}`}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                    <TagIcon className="w-3 h-3 mr-1.5" />
                                    {topic.name}
                                </Link>
                            ))}
                        </div>

                        {/* Results Count */}
                        <div className="flex items-center justify-between mb-6 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                Showing <span className="font-semibold text-gray-900 dark:text-white">{resources.length}</span> of <span className="font-semibold text-gray-900 dark:text-white">{totalResources}</span> resources
                            </span>
                        </div>

                        {/* Resource Grid */}
                        {resources.length === 0 ? (
                            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-900 mb-4">
                                    <MagnifyingGlassIcon className="h-8 w-8 text-gray-400" />
                                </div>
                                <p className="text-lg font-medium text-gray-900 dark:text-white mb-1">No resources found</p>
                                <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters or search query</p>
                                <button
                                    className="mt-4 text-primary-600 hover:underline font-medium"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        ) : (
                            <div className={view === 'grid' ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
                                {resources.map((resource) => (
                                    <ResourceCard
                                        key={resource.id}
                                        resource={{
                                            ...resource,
                                            // Map new schema fields to what ResourceCard likely expects
                                            // TODO: Verify ResourceCard props
                                            type: resource.resourceType,
                                            department: resource.course?.department || 'General',
                                            semester: resource.course?.semester ? `Sem ${resource.course.semester}` : 'N/A'
                                        }}
                                        variant={view}
                                    />
                                ))}
                            </div>
                        )}

                        <div className="mt-8 flex w-full justify-center">
                            <Pagination totalPages={totalPages} />
                        </div>

                        {/* Comments Section */}
                        <div className="mt-12 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Community Discussion</h3>
                            <PageComments
                                pageUrl="/resources"
                                comments={comments}
                                userSession={session?.user ? { name: session.user.name!, email: session.user.email! } : null}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
