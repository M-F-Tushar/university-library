'use client';

import { useActionState, useState, useRef } from 'react';
import { submitResourceForApproval, StudentUploadState } from '@/app/lib/student-actions';
import { ArrowUpTrayIcon, DocumentIcon, XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface Course {
    id: string;
    courseCode: string;
    courseTitle: string;
    year: number;
    semester: number;
}

interface StudentUploadFormProps {
    courses: Course[];
    categories: string[];
}

export default function StudentUploadForm({ courses, categories }: StudentUploadFormProps) {
    const initialState: StudentUploadState = { message: null, errors: {} };
    const [state, dispatch, isPending] = useActionState(submitResourceForApproval, initialState);
    const [file, setFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

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
            setFile(droppedFile);
            if (inputRef.current) {
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(droppedFile);
                inputRef.current.files = dataTransfer.files;
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    // Group courses by Year-Semester
    const groupedCourses = courses.reduce((acc, course) => {
        const key = `Year ${course.year} - Semester ${((course.semester - 1) % 2) + 1}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(course);
        return acc;
    }, {} as Record<string, Course[]>);

    if (state.success) {
        return (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-8 text-center">
                <div className="flex justify-center mb-4">
                    <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <CheckCircleIcon className="h-10 w-10 text-green-600 dark:text-green-400" />
                    </div>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Submission Received!
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {state.message}
                </p>
                <div className="flex justify-center gap-4">
                    <a
                        href="/dashboard/upload"
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        Submit Another
                    </a>
                    <a
                        href="/dashboard"
                        className="px-6 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        Back to Dashboard
                    </a>
                </div>
            </div>
        );
    }

    return (
        <form action={dispatch} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b dark:border-gray-700 pb-2">
                    Resource Details
                </h3>

                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Title *
                    </label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        required
                        placeholder="e.g., CSE-220 Mid-Term Questions Fall 2023"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {state.errors?.title && (
                        <p className="mt-1 text-sm text-red-500">{state.errors.title[0]}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description *
                    </label>
                    <textarea
                        name="description"
                        id="description"
                        rows={3}
                        required
                        placeholder="Describe the resource content..."
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="courseId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Course *
                        </label>
                        <select
                            name="courseId"
                            id="courseId"
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Select a course</option>
                            {Object.entries(groupedCourses).map(([group, coursesInGroup]) => (
                                <optgroup key={group} label={group}>
                                    {coursesInGroup.map((course) => (
                                        <option key={course.id} value={course.id}>
                                            {course.courseCode} - {course.courseTitle}
                                        </option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="resourceType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Type *
                        </label>
                        <select
                            name="resourceType"
                            id="resourceType"
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Select type</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label htmlFor="topics" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Tags / Topics (comma-separated)
                    </label>
                    <input
                        type="text"
                        name="topics"
                        id="topics"
                        placeholder="e.g., algorithms, data structures, midterm"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* File Upload */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b dark:border-gray-700 pb-2">
                    Upload File
                </h3>

                <div
                    className={`relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all
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
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.zip"
                        className="hidden"
                        onChange={handleChange}
                    />

                    {file ? (
                        <div className="flex items-center gap-3 text-green-700 dark:text-green-400">
                            <DocumentIcon className="w-10 h-10" />
                            <div>
                                <p className="font-medium">{file.name}</p>
                                <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); removeFile(); }}
                                className="p-2 hover:bg-green-200 dark:hover:bg-green-800 rounded-full"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center">
                            <ArrowUpTrayIcon className={`w-10 h-10 mb-3 ${dragActive ? 'text-blue-500' : 'text-gray-400'}`} />
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-400 mt-1">PDF, DOC, PPT, ZIP (Max 50MB)</p>
                        </div>
                    )}
                </div>

                <div>
                    <label htmlFor="externalUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Or provide an external link
                    </label>
                    <input
                        type="url"
                        name="externalUrl"
                        id="externalUrl"
                        placeholder="https://drive.google.com/..."
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Error Message */}
            {state.message && !state.success && (
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
                    {state.message}
                </div>
            )}

            {/* Submit */}
            <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-700">
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isPending}
                    className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
                >
                    {isPending ? 'Submitting...' : 'Submit for Review'}
                </button>
            </div>
        </form>
    );
}
