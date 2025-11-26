'use client';

import { useState, useEffect } from 'react';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';

interface Setting {
    id: string;
    key: string;
    value: string;
    type: string;
    category: string;
    description: string | null;
}

export default function SiteSettingsPage() {
    const [settings, setSettings] = useState<Setting[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await fetch('/api/admin/settings');
            const data = await response.json();
            setSettings(data);
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage('');

        try {
            const settingsToUpdate = settings.map(s => ({ key: s.key, value: s.value }));
            const response = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ settings: settingsToUpdate }),
            });

            if (response.ok) {
                setMessage('Settings saved successfully!');
                setTimeout(() => setMessage(''), 3000);
            } else {
                setMessage('Error saving settings');
            }
        } catch (error) {
            setMessage('Error saving settings');
        } finally {
            setSaving(false);
        }
    };

    const updateSetting = (key: string, value: string) => {
        setSettings(settings.map(s => s.key === key ? { ...s, value } : s));
    };

    const groupedSettings = settings.reduce((acc, setting) => {
        if (!acc[setting.category]) {
            acc[setting.category] = [];
        }
        acc[setting.category].push(setting);
        return acc;
    }, {} as Record<string, Setting[]>);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Site Settings</h1>
                    <p className="text-gray-600 mt-2">Manage your homepage content and site configuration</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50"
                >
                    <Cog6ToothIcon className="h-5 w-5" />
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {message && (
                <div className={`px-4 py-3 rounded-lg ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {message}
                </div>
            )}

            {/* Settings Groups */}
            <div className="space-y-6">
                {Object.entries(groupedSettings).map(([category, categorySettings]) => (
                    <div key={category} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-50 to-violet-50 px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900 capitalize">{category} Settings</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            {categorySettings.map((setting) => (
                                <div key={setting.key}>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {setting.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </label>
                                    {setting.description && (
                                        <p className="text-xs text-gray-500 mb-2">{setting.description}</p>
                                    )}
                                    {setting.type === 'text' && setting.value.length > 100 ? (
                                        <textarea
                                            value={setting.value}
                                            onChange={(e) => updateSetting(setting.key, e.target.value)}
                                            rows={3}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            value={setting.value}
                                            onChange={(e) => updateSetting(setting.key, e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
