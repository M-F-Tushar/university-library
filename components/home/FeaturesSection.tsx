import Link from 'next/link';
import Image from 'next/image';
import { BookOpenIcon, AcademicCapIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const iconMap: Record<string, any> = {
    BookOpenIcon,
    AcademicCapIcon,
    DocumentTextIcon,
};

interface Feature {
    id: string;
    title: string;
    description: string;
    icon: string;
    link?: string | null;
    coverImage?: string | null;
}

interface FeaturesSectionProps {
    title: string;
    subtitle: string;
    features: Feature[];
}

export function FeaturesSection({ title, subtitle, features }: FeaturesSectionProps) {
    return (
        <div id="features" className="py-24 bg-gray-50 dark:bg-black">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-base font-semibold text-blue-600 dark:text-blue-400 tracking-wide uppercase">Features</h2>
                    <p className="mt-2 text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
                        {title}
                    </p>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
                        {subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {features.map((feature) => {
                        const Icon = iconMap[feature.icon] || BookOpenIcon;

                        const CardContent = (
                            <div className={`group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900 p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-800 h-full flex flex-col ${feature.link ? 'cursor-pointer' : ''}`}>
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>

                                {feature.coverImage ? (
                                    <div className="relative h-48 w-full mb-6 rounded-xl overflow-hidden">
                                        <Image
                                            src={feature.coverImage}
                                            alt={feature.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    </div>
                                ) : (
                                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                        <Icon className="h-7 w-7" />
                                    </div>
                                )}

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{feature.title}</h3>
                                <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed flex-grow">
                                    {feature.description}
                                </p>
                            </div>
                        );

                        return feature.link ? (
                            <Link key={feature.id} href={feature.link} className="block h-full">
                                {CardContent}
                            </Link>
                        ) : (
                            <div key={feature.id} className="h-full">
                                {CardContent}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
