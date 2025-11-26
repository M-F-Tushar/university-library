'use client';

import { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function SearchWithSuggestions() {
    const searchParams = useSearchParams();
    const initialSearch = searchParams.get('search') || '';
    const [query, setQuery] = useState(initialSearch);
    const [suggestions, setSuggestions] = useState<{ titles: any[], authors: any[], tags: any[] }>({ titles: [], authors: [], tags: [] });
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (query.length < 2) {
                setSuggestions({ titles: [], authors: [], tags: [] });
                return;
            }

            try {
                const res = await fetch(`/api/resources/suggestions?query=${encodeURIComponent(query)}`);
                if (res.ok) {
                    const data = await res.json();
                    setSuggestions(data);
                }
            } catch (error) {
                console.error('Error fetching suggestions:', error);
            }
        };

        const debounce = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(debounce);
    }, [query]);

    const handleSearch = (term: string) => {
        setQuery(term);
        setShowSuggestions(false);
        // Trigger search by updating URL or submitting form if strictly needed, 
        // but usually clicking a suggestion should navigate or fill input.
        // If it's a resource title, go to detail? Or just search?
        // Let's just search for now to be safe.
        const params = new URLSearchParams(searchParams);
        params.set('search', term);
        params.delete('page'); // Reset page
        router.push(`/resources?${params.toString()}`);
    };

    return (
        <div className="relative flex-1" ref={wrapperRef}>
            <input
                type="text"
                name="search"
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search by title, author, course, or topic..."
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white pl-11 pr-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 border transition-all"
                autoComplete="off"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

            {showSuggestions && (suggestions.titles.length > 0 || suggestions.authors.length > 0 || suggestions.tags.length > 0) && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
                    {suggestions.titles.length > 0 && (
                        <div className="p-2">
                            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase px-2 mb-1">Resources</h3>
                            {suggestions.titles.map((item: any) => (
                                <Link
                                    key={item.id}
                                    href={`/resources/${item.id}`}
                                    className="block px-2 py-1.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-md"
                                    onClick={() => setShowSuggestions(false)}
                                >
                                    {item.text}
                                </Link>
                            ))}
                        </div>
                    )}

                    {suggestions.authors.length > 0 && (
                        <div className="p-2 border-t border-gray-100 dark:border-gray-700">
                            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase px-2 mb-1">Authors</h3>
                            {suggestions.authors.map((item: any, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSearch(item.text)}
                                    className="block w-full text-left px-2 py-1.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-md"
                                >
                                    {item.text}
                                </button>
                            ))}
                        </div>
                    )}

                    {suggestions.tags.length > 0 && (
                        <div className="p-2 border-t border-gray-100 dark:border-gray-700">
                            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase px-2 mb-1">Topics</h3>
                            {suggestions.tags.map((item: any, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSearch(item.text)}
                                    className="block w-full text-left px-2 py-1.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-md"
                                >
                                    # {item.text}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
