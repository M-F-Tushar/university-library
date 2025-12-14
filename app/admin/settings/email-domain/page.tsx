'use client';

import { useState, useEffect } from 'react';
import { EnvelopeIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function EmailDomainSettings() {
    const [domain, setDomain] = useState('');
    const [originalDomain, setOriginalDomain] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        fetchCurrentDomain();
    }, []);

    const fetchCurrentDomain = async () => {
        try {
            const response = await fetch('/api/admin/settings/email-domain');
            if (response.ok) {
                const data = await response.json();
                setDomain(data.domain || '@university.edu');
                setOriginalDomain(data.domain || '@university.edu');
            }
        } catch (error) {
            console.error('Failed to fetch domain setting:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        // Validate domain format
        if (!domain.startsWith('@') || domain.length < 4) {
            setMessage({ type: 'error', text: 'Domain must start with @ and be at least 4 characters (e.g., @uiu.ac.bd)' });
            setSaving(false);
            return;
        }

        try {
            const response = await fetch('/api/admin/settings/email-domain', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ domain }),
            });

            if (response.ok) {
                setOriginalDomain(domain);
                setMessage({ type: 'success', text: 'Email domain updated successfully!' });
            } else {
                const data = await response.json();
                setMessage({ type: 'error', text: data.error || 'Failed to update domain' });
            }
        } catch {
            setMessage({ type: 'error', text: 'Network error. Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    const hasChanges = domain !== originalDomain;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Email Domain Settings</h1>
                <p className="text-gray-600 mt-2">Configure which email domain can access the library</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start gap-4 mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                        <EnvelopeIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Allowed Email Domain</h2>
                        <p className="text-sm text-gray-500">
                            Only users with email addresses from this domain can register and log in.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-2">
                            Email Domain
                        </label>
                        <input
                            id="domain"
                            type="text"
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                            placeholder="@university.edu"
                            className="block w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <p className="mt-2 text-xs text-gray-500">
                            Example: <code className="bg-gray-100 px-1 py-0.5 rounded">@uiu.ac.bd</code> or <code className="bg-gray-100 px-1 py-0.5 rounded">@student.university.edu</code>
                        </p>
                    </div>

                    {message && (
                        <div className={`flex items-center gap-2 px-4 py-3 rounded-lg ${message.type === 'success'
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                            {message.type === 'success' ? (
                                <CheckCircleIcon className="h-5 w-5" />
                            ) : (
                                <ExclamationTriangleIcon className="h-5 w-5" />
                            )}
                            {message.text}
                        </div>
                    )}

                    <div className="flex items-center gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={saving || !hasChanges}
                            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                        {hasChanges && (
                            <button
                                type="button"
                                onClick={() => setDomain(originalDomain)}
                                className="px-6 py-2.5 text-gray-700 font-medium hover:text-gray-900"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Info box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="font-semibold text-blue-900 mb-2">How it works</h3>
                <ul className="text-sm text-blue-800 space-y-2">
                    <li>• Students enter their university email on the login page</li>
                    <li>• If the email ends with the allowed domain, they receive a login link</li>
                    <li>• Clicking the link logs them in (no password needed)</li>
                    <li>• Emails from other domains are rejected</li>
                </ul>
            </div>
        </div>
    );
}
