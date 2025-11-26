import Link from 'next/link';
import { BookOpenIcon, DocumentTextIcon, AcademicCapIcon, PresentationChartBarIcon, RectangleStackIcon } from '@heroicons/react/24/outline';
import prisma from '@/lib/prisma';

export default async function CategoriesPage() {
    // Fetch categories from database
    const categoriesData = await prisma.category.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' },
    });

    // Map icon names to actual components
    const iconMap: Record<string, any> = {
        'BookOpenIcon': BookOpenIcon,
        'DocumentTextIcon': DocumentTextIcon,
        'AcademicCapIcon': AcademicCapIcon,
        'PresentationChartBarIcon': PresentationChartBarIcon,
        'RectangleStackIcon': RectangleStackIcon,
    };

    const categories = categoriesData.map(cat => ({
        name: cat.name,
        description: cat.description || `Browse ${cat.name.toLowerCase()} resources`,
        icon: iconMap[cat.icon] || BookOpenIcon,
        color: cat.color,
        href: `/resources?category=${cat.name}`,
    }));

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-black p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent mb-4">
                        Explore by Category
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Browse our extensive collection of resources organized by type.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map((category) => (
                        <Link
                            key={category.name}
                            href={category.href}
                            className="group relative bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 hover:-translate-y-1"
                        >
                            <div className={`inline-flex p-4 rounded-xl mb-6 ${category.color} group-hover:scale-110 transition-transform duration-300`}>
                                <category.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {category.name}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                {category.description}
                            </p>
                            <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                                <span className="text-blue-600 dark:text-blue-400 font-medium flex items-center">
                                    Browse <span className="ml-2">→</span>
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
