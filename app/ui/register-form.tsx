'use client';

import { useState } from 'react';
import { AtSymbolIcon, KeyIcon, UserIcon, ExclamationCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setPending(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData);

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.message || 'Something went wrong');
            }

            // Redirect to login on success
            router.push('/login?registered=true');
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setPending(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="name">
                    Full Name
                </label>
                <div className="relative">
                    <input
                        className="peer block w-full rounded-lg border border-gray-300 py-3 pl-11 pr-4 text-sm outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        id="name"
                        type="text"
                        name="name"
                        placeholder="John Doe"
                        required
                    />
                    <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 peer-focus:text-blue-500 transition-colors" />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
                    Email Address
                </label>
                <div className="relative">
                    <input
                        className="peer block w-full rounded-lg border border-gray-300 py-3 pl-11 pr-4 text-sm outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        id="email"
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        required
                    />
                    <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 peer-focus:text-blue-500 transition-colors" />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">
                    Password
                </label>
                <div className="relative">
                    <input
                        className="peer block w-full rounded-lg border border-gray-300 py-3 pl-11 pr-4 text-sm outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        id="password"
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        required
                        minLength={6}
                    />
                    <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 peer-focus:text-blue-500 transition-colors" />
                </div>
                <p className="mt-1 text-xs text-gray-500">Minimum 6 characters</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="role">
                    Account Type
                </label>
                <select
                    name="role"
                    id="role"
                    className="block w-full rounded-lg border border-gray-300 py-3 px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                >
                    <option value="STUDENT">Student</option>
                    <option value="ADMIN">Admin</option>
                </select>
            </div>

            <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-3 text-sm font-semibold text-white hover:from-blue-700 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:transform-none"
                disabled={pending}
            >
                {pending ? (
                    <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Creating account...</span>
                    </>
                ) : (
                    <>
                        <span>Register</span>
                        <ArrowRightIcon className="h-5 w-5" />
                    </>
                )}
            </button>

            <div className="flex items-center gap-2 min-h-[2rem]" aria-live="polite" aria-atomic="true">
                {error && (
                    <div className="flex items-center gap-2 text-red-500 bg-red-50 px-3 py-2 rounded-lg border border-red-200 w-full">
                        <ExclamationCircleIcon className="h-5 w-5 flex-shrink-0" />
                        <p className="text-sm">{error}</p>
                    </div>
                )}
            </div>

            <div className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-blue-600 hover:text-blue-700 hover:underline">
                    Log in
                </Link>
            </div>
        </form>
    );
}
