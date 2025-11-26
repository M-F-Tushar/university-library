'use client';

import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Format {
    id: string;
    name: string;
    extension: string;
    mimeType: string | null;
    order: number;
    isActive: boolean;
}

export default function FormatsManagementPage() {
    const [formats, setFormats] = useState<Format[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingFormat, setEditingFormat] = useState<Format | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        extension: '',
        mimeType: '',
        order: 0,
    });

    useEffect(() => {
        fetchFormats();
    }, []);

    const fetchFormats = async () => {
        try {
            const response = await fetch('/api/admin/formats');
            const data = await response.json();
            setFormats(data);
        } catch (error) {
            console.error('Error fetching formats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const url = editingFormat
                ? `/api/admin/formats/${editingFormat.id}`
                : '/api/admin/formats';

            const method = editingFormat ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                fetchFormats();
                setShowModal(false);
                resetForm();
            }
        } catch (error) {
            console.error('Error saving format:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this format?')) return;

        try {
            const response = await fetch(`/api/admin/formats/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchFormats();
            }
        } catch (error) {
            console.error('Error deleting format:', error);
        }
    };

    const handleEdit = (format: Format) => {
        setEditingFormat(format);
        setFormData({
            name: format.name,
            extension: format.extension,
            mimeType: format.mimeType || '',
            order: format.order,
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setEditingFormat(null);
        setFormData({
            name: '',
            extension: '',
            mimeType: '',
            order: 0,
        });
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">File Formats Management</h1>
                    <p className="text-gray-600 mt-2">Manage supported file formats dynamically</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:from-purple-700 hover:to-blue-700 transition-all"
                >
                    <PlusIcon className="h-5 w-5" />
                    Add Format
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {formats.map((format) => (
                    <div key={format.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{format.name}</h3>
                                <p className="text-sm text-gray-500 mt-1">.{format.extension}</p>
                                {format.mimeType && (
                                    <p className="text-xs text-gray-400 mt-1 font-mono">{format.mimeType}</p>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(format)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    <PencilIcon className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(format.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <TrashIcon className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Order: {format.order}</span>
                            <span className={format.isActive ? 'text-green-600' : 'text-red-600'}>
                                {format.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-6">
                            {editingFormat ? 'Edit Format' : 'Add Format'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                    placeholder="e.g., PDF, DOCX"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Extension *</label>
                                <input
                                    type="text"
                                    value={formData.extension}
                                    onChange={(e) => setFormData({ ...formData, extension: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                    placeholder="e.g., pdf, docx"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">MIME Type</label>
                                <input
                                    type="text"
                                    value={formData.mimeType}
                                    onChange={(e) => setFormData({ ...formData, mimeType: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                    placeholder="e.g., application/pdf"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                                <input
                                    type="number"
                                    value={formData.order}
                                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
                                >
                                    {editingFormat ? 'Update' : 'Create'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setShowModal(false); resetForm(); }}
                                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
