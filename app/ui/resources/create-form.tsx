'use client';

import { useActionState, useState, useRef, useEffect } from 'react';
import { createResource, State } from '@/app/lib/actions';
import { ArrowUpTrayIcon, DocumentIcon, XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';

export default function CreateResourceForm() {
    const initialState: State = { message: null, errors: {} };
    const [state, dispatch, isPending] = useActionState(createResource, initialState);
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [coverImageUrl, setCoverImageUrl] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    // Dynamic data from API
    const [categories, setCategories] = useState<string[]>([]);
    const [formats, setFormats] = useState<string[]>([]);
    const [semesters, setSemesters] = useState<string[]>([]);

    // Fetch dynamic data on mount
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [categoriesRes, formatsRes, semestersRes] = await Promise.all([
                    fetch('/api/admin/categories?active=true'),
                    fetch('/api/admin/formats?active=true'),
                    fetch('/api/admin/semesters?active=true'),
                ]);

                const [categoriesData, formatsData, semestersData] = await Promise.all([
                    categoriesRes.json(),
                    formatsRes.json(),
                    semestersRes.json(),
                ]);

                setCategories(categoriesData.map((c: any) => c.name));
                setFormats(formatsData.map((f: any) => f.name));
                setSemesters(semestersData.map((s: any) => s.value));
            } catch (error) {
                console.error('Error fetching form options:', error);
            }
        };

        fetchOptions();
    }, []);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.type === 'application/pdf') {
                setFile(droppedFile);
                if (inputRef.current) {
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(droppedFile);
                    inputRef.current.files = dataTransfer.files;
                }
            } else {
                alert('Only PDF files are allowed.');
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const removeFile = () => {
        setFile(null);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    return (
        <form action={dispatch} className="space-y-6 bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
            {/* Basic Information */}
            <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">Basic Information</h3>

                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title *</label>
                    <input type="text" name="title" id="title" required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                    <div id="title-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.title &&
                            state.errors.title.map((error: string) => (
                                <p key={error} className="mt-2 text-sm text-red-500">
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description *</label>
                    <textarea name="description" id="description" rows={3} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"></textarea>
                </div>

                <div>
                    <label htmlFor="abstract" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Abstract (Optional - for Papers)</label>
                    <textarea name="abstract" id="abstract" rows={4} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" placeholder="Detailed abstract for research papers..."></textarea>
                </div>
            </div>

            {/* Metadata */}
            <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">Metadata</h3>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Author (Optional)</label>
                        <input type="text" name="author" id="author" className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" placeholder="e.g. Robert C. Martin" />
                    </div>

                    <div>
                        <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Year (Optional)</label>
                        <input type="number" name="year" id="year" min="1900" max="2100" className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" placeholder="2024" />
                    </div>

                    <div>
                        <label htmlFor="format" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Format (Optional)</label>
                        <select name="format" id="format" className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2">
                            <option value="">Select format</option>
                            {formats.map((fmt) => (
                                <option key={fmt} value={fmt}>{fmt}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="fileSize" className="block text-sm font-medium text-gray-700 dark:text-gray-300">File Size (Optional)</label>
                        <input type="text" name="fileSize" id="fileSize" className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" placeholder="e.g. 5MB" />
                    </div>
                </div>
            </div>

            {/* Cover Image */}
            <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">Cover Image</h3>

                <div>
                    <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cover Image URL (Optional)</label>
                    <input
                        type="url"
                        name="coverImage"
                        id="coverImage"
                        value={coverImageUrl}
                        onChange={(e) => setCoverImageUrl(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                        placeholder="https://example.com/cover.jpg"
                    />
                    {coverImageUrl && (
                        <div className="mt-4 border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Preview:</p>
                            <img
                                src={coverImageUrl}
                                alt="Cover preview"
                                className="h-48 w-auto object-cover rounded-md"
                                onError={(e) => {
                                    e.currentTarget.src = '';
                                    e.currentTarget.alt = 'Failed to load image';
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Classification */}
            <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">Classification</h3>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category *</label>
                        <select name="category" id="category" required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2">
                            <option value="">Select category</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Department *</label>
                        <input type="text" name="department" id="department" required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" placeholder="e.g. Computer Science" />
                    </div>

                    <div>
                        <label htmlFor="course" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Course (Optional)</label>
                        <input type="text" name="course" id="course" className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" placeholder="e.g. CS201" />
                    </div>

                    <div>
                        <label htmlFor="semester" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Semester (Optional)</label>
                        <select name="semester" id="semester" className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2">
                            <option value="">Select semester</option>
                            {semesters.map((sem) => (
                                <option key={sem} value={sem}>{sem} Semester</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* File Upload */}
            <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">File & Links</h3>

                <div>
                    <label htmlFor="file" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">PDF File (Optional)</label>
                    <div
                        className={`relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                            ${dragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'}
                            ${file ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : ''}`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => inputRef.current?.click()}
                    >
                        <input
                            ref={inputRef}
                            type="file"
                            name="file"
                            id="file"
                            accept=".pdf"
                            className="hidden"
                            onChange={handleChange}
                        />

                        {file ? (
                            <div className="flex items-center space-x-2 text-green-700 dark:text-green-400">
                                <DocumentIcon className="w-8 h-8" />
                                <span className="font-medium">{file.name}</span>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeFile();
                                    }}
                                    className="p-1 hover:bg-green-200 dark:hover:bg-green-800 rounded-full"
                                >
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <ArrowUpTrayIcon className={`w-8 h-8 mb-3 ${dragActive ? 'text-blue-500' : 'text-gray-400 dark:text-gray-500'}`} />
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">PDF (MAX. 10MB)</p>
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <label htmlFor="externalUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">External URL (Optional)</label>
                    <input type="url" name="externalUrl" id="externalUrl" className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" placeholder="https://..." />
                </div>

                <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tags (Comma separated)</label>
                    <input type="text" name="tags" id="tags" className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" placeholder="algorithms, data structures, programming" />
                </div>
            </div>

            {state.message && (
                <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-md">{state.message}</div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                    {isPending ? 'Creating...' : 'Create Resource'}
                </button>
            </div>
        </form>
    );
}
