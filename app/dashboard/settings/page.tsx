'use client';

import { useState, useEffect } from 'react';
import { PencilIcon, CheckIcon } from '@heroicons/react/24/outline';

interface Setting {
    id: string;
    key: string;
    value: string;
    category: string;
    description: string | null;
}

export default function SettingsPage() {
    const [settings, setSettings] = useState<Setting[]>([]);
    const [editedSettings, setEditedSettings] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await fetch('/api/admin/settings');
            if (response.ok) {
                const data = await response.json();
                setSettings(data);
                // Initialize edited settings
                const initial: Record<string, string> = {};
                data.forEach((s: Setting) => {
                    initial[s.key] = s.value;
                });
                setEditedSettings(initial);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);

        try {
            const settingsToUpdate = Object.keys(editedSettings).map(key => ({
                key,
                value: editedSettings[key],
            }));

            const response = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ settings: settingsToUpdate }),
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'Settings saved successfully!' });
                fetchSettings(); // Refresh
            } else {
                setMessage({ type: 'error', text: 'Failed to save settings' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred' });
        } finally {
            setSaving(false);
        }
    };

    const groupedSettings = settings.reduce((acc, setting) => {
        if (!acc[setting.category]) {
            acc[setting.category] = [];
        }
        acc[setting.category].push(setting);
        return acc;
    }, {} as Record<string, Setting[]>);

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent mb-2">
                    Site Settings
                </h1>
                <p className="text-gray-600">Manage your website content and configuration</p>
            </div>

            {message && (
                <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                    {message.text}
                </div>
            )}

            <div className="space-y-8">
                {Object.entries(groupedSettings).map(([category, categorySettings]) => (
                    <div key={category} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-50 to-violet-50 px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900 capitalize">{category} Settings</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            {categorySettings.map((setting) => (
                                <div key={setting.key} className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        {setting.description || setting.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </label>
                                    {setting.key.includes('subtitle') || setting.key.includes('description') || setting.key.includes('content') ? (
                                        <textarea
                                            value={editedSettings[setting.key] || ''}
                                            onChange={(e) => setEditedSettings({ ...editedSettings, [setting.key]: e.target.value })}
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                            rows={3}
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            value={editedSettings[setting.key] || ''}
                                            onChange={(e) => setEditedSettings({ ...editedSettings, [setting.key]: e.target.value })}
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 flex justify-end gap-4">
                <button
                    onClick={() => fetchSettings()}
                    className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all"
                >
                    Reset
                </button>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 text-white font-medium hover:from-blue-700 hover:to-violet-700 disabled:opacity-50 transition-all shadow-md hover:shadow-lg"
                >
                    {saving ? (
                        <>
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Saving...</span>
                        </>
                    ) : (
                        <>
                            <CheckIcon className="h-5 w-5" />
                            <span>Save Changes</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
