'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, CloudArrowUpIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function EditSemesterPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        value: '',
        description: '',
        order: 0,
        isActive: true,
    });

    const [resourceData, setResourceData] = useState({
        title: '',
        description: '',
        category: 'Notes',
        department: 'Computer Science',
        fileUrl: '',
        externalUrl: '',
        tags: '',
    });

    useEffect(() => {
        fetchSemester();
    }, []);

    const fetchSemester = async () => {
        try {
            const response = await fetch(`/api/admin/semesters/${id}`);
            if (response.ok) {
                const data = await response.json();
                setFormData(data);
            }
        } catch (error) {
            console.error('Error fetching semester:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            const response = await fetch(`/api/admin/semesters/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setMessage('Semester updated successfully!');
                setTimeout(() => router.push('/admin/semesters'), 1500);
            } else {
                setMessage('Error updating semester');
            }
        } catch (error) {
            setMessage('Error updating semester');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this semester?')) return;

        try {
            const response = await fetch(`/api/admin/semesters/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                router.push('/admin/semesters');
            } else {
                setMessage('Error deleting semester');
            }
        } catch (error) {
            setMessage('Error deleting semester');
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        setUploading(true);

        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setResourceData({ ...resourceData, fileUrl: data.url });
            } else {
                alert('Failed to upload file');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Error uploading file');
        } finally {
            setUploading(false);
        }
    };

    const handleAddResource = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const response = await fetch('/api/admin/resources', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...resourceData,
                    semester: formData.value, // Link to this semester
                }),
            });

            if (response.ok) {
                alert('Resource added successfully!');
                setResourceData({
                    title: '',
                    description: '',
                    category: 'Notes',
                    department: 'Computer Science',
                    fileUrl: '',
                    externalUrl: '',
                    tags: '',
                });
            } else {
                alert('Failed to add resource');
            }
        } catch (error) {
            console.error('Error adding resource:', error);
            alert('Error adding resource');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/semesters" className="p-2 hover:bg-gray-100 rounded-lg">
                    <ArrowLeftIcon className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Edit Semester</h1>
                    <p className="text-gray-600 mt-2">Update semester details and add resources</p>
                </div>
            </div>

            {message && (
                <div className={`px-4 py-3 rounded-lg ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {message}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Edit Semester Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6 h-fit">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Semester Details</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Value (URL Slug)</label>
                            <input
                                type="text"
                                value={formData.value}
                                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                            <input
                                type="number"
                                value={formData.order}
                                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                                value={formData.description || ''}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>

                        <div className="flex items-center">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                />
                                <span className="text-sm font-medium text-gray-700">Active</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all"
                        >
                            Delete
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>

                {/* Add Resource Form */}
                <form onSubmit={handleAddResource} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6 h-fit">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Add Resource to {formData.name}</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Resource Title</label>
                            <input
                                type="text"
                                value={resourceData.title}
                                onChange={(e) => setResourceData({ ...resourceData, title: e.target.value })}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                                value={resourceData.description}
                                onChange={(e) => setResourceData({ ...resourceData, description: e.target.value })}
                                required
                                rows={2}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                <select
                                    value={resourceData.category}
                                    onChange={(e) => setResourceData({ ...resourceData, category: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                >
                                    <option value="Notes">Notes</option>
                                    <option value="Questions">Past Questions</option>
                                    <option value="Books">Books</option>
                                    <option value="Papers">Papers</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                                <input
                                    type="text"
                                    value={resourceData.department}
                                    onChange={(e) => setResourceData({ ...resourceData, department: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Upload File OR External Link</label>

                            {/* File Upload */}
                            <div className="mb-4">
                                <div className="flex items-center gap-4">
                                    <label className="flex-1 cursor-pointer">
                                        <div className={`flex items-center justify-center w-full h-24 px-4 transition border-2 border-dashed rounded-lg ${resourceData.externalUrl ? 'bg-gray-100 border-gray-200 cursor-not-allowed' : 'bg-white border-gray-300 hover:bg-gray-50 hover:border-purple-500'}`}>
                                            <div className="flex flex-col items-center space-y-2">
                                                <CloudArrowUpIcon className={`w-6 h-6 ${resourceData.externalUrl ? 'text-gray-300' : 'text-gray-400'}`} />
                                                <span className={`font-medium ${resourceData.externalUrl ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    {uploading ? 'Uploading...' : resourceData.fileUrl ? 'File Uploaded' : 'Click to Upload File'}
                                                </span>
                                            </div>
                                            <input
                                                type="file"
                                                className="hidden"
                                                onChange={handleFileUpload}
                                                disabled={!!resourceData.externalUrl}
                                            />
                                        </div>
                                    </label>
                                </div>
                                {resourceData.fileUrl && (
                                    <div className="flex justify-between items-center mt-2">
                                        <p className="text-sm text-green-600">File uploaded: {resourceData.fileUrl.split('/').pop()}</p>
                                        <button
                                            type="button"
                                            onClick={() => setResourceData({ ...resourceData, fileUrl: '' })}
                                            className="text-red-500 text-xs hover:underline"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="relative flex py-2 items-center">
                                <div className="flex-grow border-t border-gray-300"></div>
                                <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">OR</span>
                                <div className="flex-grow border-t border-gray-300"></div>
                            </div>

                            {/* External Link */}
                            <div className="mt-2">
                                <input
                                    type="url"
                                    value={resourceData.externalUrl || ''}
                                    onChange={(e) => setResourceData({ ...resourceData, externalUrl: e.target.value })}
                                    placeholder="https://example.com/resource"
                                    disabled={!!resourceData.fileUrl}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
                            <input
                                type="text"
                                value={resourceData.tags}
                                onChange={(e) => setResourceData({ ...resourceData, tags: e.target.value })}
                                placeholder="e.g. math, algorithms, exam"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={saving || (!resourceData.fileUrl && !resourceData.externalUrl)}
                            className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-teal-700 transition-all disabled:opacity-50 shadow-md hover:shadow-lg"
                        >
                            {saving ? 'Adding...' : 'Add Resource'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
