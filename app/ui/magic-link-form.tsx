'use client';

import { useState } from 'react';
import { EnvelopeIcon, ArrowRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { signIn } from 'next-auth/react';

interface MagicLinkFormProps {
    allowedDomain: string;
}

export default function MagicLinkForm({ allowedDomain }: MagicLinkFormProps) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        // Basic domain check before submitting
        if (!email.toLowerCase().endsWith(allowedDomain.toLowerCase())) {
            setError(`Only ${allowedDomain} emails are allowed.`);
            setLoading(false);
            return;
        }

        try {
            // Use NextAuth signIn with 'email' provider
            const result = await signIn('email', {
                email,
                redirect: false,
                callbackUrl: '/dashboard',
            });

            if (result?.error) {
                // If signIn returns error (e.g. from callback), handle it
                if (result.error.includes('AccessDenied')) {
                    setError('Access denied. Please check your email domain.');
                } else {
                    setError('Failed to send login link. Please try again.');
                }
            } else {
                setSuccess(true);
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="text-center py-4">
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircleIcon className="h-8 w-8 text-green-600" />
                    </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Check your email!</h3>
                <p className="text-gray-600 mb-4">
                    We sent a login link to <strong>{email}</strong>
                </p>
                <p className="text-sm text-gray-500">
                    The link will expire in 15 minutes.
                </p>
                <div className="mt-8 p-4 bg-yellow-50 rounded-lg text-sm text-yellow-800">
                    <p className="font-semibold mb-1">Testing Note:</p>
                    <p>If SMTP is not configured, check the server console logs for the magic link.</p>
                </div>
                <button
                    onClick={() => {
                        setSuccess(false);
                        setEmail('');
                    }}
                    className="mt-6 text-blue-600 hover:underline text-sm font-medium"
                >
                    Use a different email
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    University Email
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={`yourname${allowedDomain}`}
                        required
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                    Only <span className="font-medium text-blue-600">{allowedDomain}</span> emails are allowed
                </p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={loading || !email}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-violet-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Sending...</span>
                    </>
                ) : (
                    <>
                        <span>Send Login Link</span>
                        <ArrowRightIcon className="h-5 w-5" />
                    </>
                )}
            </button>
        </form>
    );
}
