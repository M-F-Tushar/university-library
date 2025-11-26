'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

interface SearchBarProps {
    onSearch?: (query: string, filters: SearchFilters) => void;
}

export interface SearchFilters {
    category?: string;
    semester?: string;
    department?: string;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('q') || '');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<SearchFilters>({
        category: searchParams.get('category') || undefined,
        semester: searchParams.get('semester') || undefined,
        department: searchParams.get('department') || undefined,
    });

    // Dynamic data from API
    const [categories, setCategories] = useState<string[]>([]);
    const [departments, setDepartments] = useState<string[]>([]);
    const [semesters, setSemesters] = useState<string[]>([]);

    // Fetch dynamic data on mount
    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                const [categoriesRes, departmentsRes, semestersRes] = await Promise.all([
                    fetch('/api/admin/categories?active=true'),
                    fetch('/api/admin/departments?active=true'),
                    fetch('/api/admin/semesters?active=true'),
                ]);

                const [categoriesData, departmentsData, semestersData] = await Promise.all([
                    categoriesRes.json(),
                    departmentsRes.json(),
                    semestersRes.json(),
                ]);

                setCategories(categoriesData.map((c: any) => c.name));
                setDepartments(departmentsData.map((d: any) => d.name));
                setSemesters(semestersData.map((s: any) => s.value));
            } catch (error) {
                console.error('Error fetching filter options:', error);
            }
        };

        fetchFilterOptions();
    }, []);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            handleSearch();
        }, 300);

        return () => clearTimeout(timer);
    }, [query, filters]);

    const handleSearch = useCallback(() => {
        const params = new URLSearchParams();
        if (query) params.set('q', query);
        if (filters.category) params.set('category', filters.category);
        if (filters.semester) params.set('semester', filters.semester);
        if (filters.department) params.set('department', filters.department);

        const queryString = params.toString();
        router.push(`/resources${queryString ? `?${queryString}` : ''}`);

        if (onSearch) {
            onSearch(query, filters);
        }
    }, [query, filters, router, onSearch]);

    const clearFilters = () => {
        setFilters({});
        setQuery('');
    };

    const hasActiveFilters = query || filters.category || filters.semester || filters.department;

    return (
        <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search resources by title, author, tags..."
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                    <FunnelIcon className={`h-5 w-5 ${hasActiveFilters ? 'text-blue-600' : 'text-gray-400'}`} />
                </button>
            </div>

            {/* Filters */}
            {showFilters && (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Category Filter - Dynamic */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Category
                            </label>
                            <select
                                value={filters.category || ''}
                                onChange={(e) => setFilters({ ...filters, category: e.target.value || undefined })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            >
                                <option value="">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Semester Filter - Dynamic */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Semester
                            </label>
                            <select
                                value={filters.semester || ''}
                                onChange={(e) => setFilters({ ...filters, semester: e.target.value || undefined })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            >
                                <option value="">All Semesters</option>
                                {semesters.map((sem) => (
                                    <option key={sem} value={sem}>{sem} Semester</option>
                                ))}
                            </select>
                        </div>

                        {/* Department Filter - Dynamic */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Department
                            </label>
                            <select
                                value={filters.department || ''}
                                onChange={(e) => setFilters({ ...filters, department: e.target.value || undefined })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            >
                                <option value="">All Departments</option>
                                {departments.map((dept) => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Clear Filters */}
                    {hasActiveFilters && (
                        <div className="flex justify-end">
                            <button
                                onClick={clearFilters}
                                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
