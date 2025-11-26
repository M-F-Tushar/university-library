'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function EditFeaturePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        icon: 'BookOpenIcon',
        link: '',
        coverImage: '',
        isActive: true,
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');

    useEffect(() => {
        fetchFeature();
    }, []);

    const fetchFeature = async () => {
        try {
            const response = await fetch(`/api/admin/features/${id}`);
            if (response.ok) {
                const feature = await response.json();
                setFormData(feature);
                if (feature.coverImage) {
                    setImagePreview(feature.coverImage);
                }
            }
        } catch (error) {
            console.error('Error fetching feature:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            let coverImagePath = formData.coverImage;

            // Upload image if a new one was selected
            if (imageFile) {
                const formDataUpload = new FormData();
                formDataUpload.append('file', imageFile);

                const uploadResponse = await fetch('/api/upload', {
                    method: 'POST',
                    body: formDataUpload,
                });

                if (uploadResponse.ok) {
                    const { url } = await uploadResponse.json();
                    coverImagePath = url;
                } else {
                    throw new Error('Failed to upload image');
                }
            }

            const response = await fetch(`/api/admin/features/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    coverImage: coverImagePath,
                }),
            });

            if (response.ok) {
                setMessage('Feature updated successfully!');
                setTimeout(() => router.push('/admin/features'), 1500);
            } else {
                setMessage('Error updating feature');
            }
        } catch (error) {
            setMessage(error instanceof Error ? error.message : 'Error updating feature');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this feature?')) return;

        try {
            const response = await fetch(`/api/admin/features/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                router.push('/admin/features');
            } else {
                setMessage('Error deleting feature');
            }
        } catch (error) {
            setMessage('Error deleting feature');
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
                <Link href="/admin/features" className="p-2 hover:bg-gray-100 rounded-lg">
                    <ArrowLeftIcon className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Edit Feature</h1>
                    <p className="text-gray-600 mt-2">Update feature card details</p>
                </div>
            </div>

            {message && (
                <div className={`px-4 py-3 rounded-lg ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                        <select
                            value={formData.icon}
                            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                            <option value="BookOpenIcon">Book Open</option>
                            <option value="AcademicCapIcon">Academic Cap</option>
                            <option value="DocumentTextIcon">Document Text</option>
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Link (Optional)</label>
                        <input
                            type="url"
                            value={formData.link || ''}
                            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                            placeholder="https://example.com or /resources"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">URL to navigate when feature card is clicked</p>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Book Cover Image (Optional)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">Upload a book cover image for this feature</p>
                        {imagePreview && (
                            <div className="mt-4">
                                <img src={imagePreview} alt="Cover preview" className="h-48 w-auto rounded-lg shadow-md" />
                            </div>
                        )}
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
                        Delete Feature
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
        </div>
    );
}
