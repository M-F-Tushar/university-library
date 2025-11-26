'use client';

import { authenticate } from '@/app/lib/actions';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { AtSymbolIcon, KeyIcon, ExclamationCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function LoginForm() {
    const [errorMessage, dispatch, isPending] = useActionState(authenticate, undefined);

    return (
        <form action={dispatch} className="space-y-5">
            <div>
                <label
                    className="block text-sm font-medium text-gray-700 mb-2"
                    htmlFor="email"
                >
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
                <label
                    className="block text-sm font-medium text-gray-700 mb-2"
                    htmlFor="password"
                >
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
            </div>

            <LoginButton />

            <div
                className="flex items-center gap-2 min-h-[2rem]"
                aria-live="polite"
                aria-atomic="true"
            >
                {errorMessage && (
                    <div className="flex items-center gap-2 text-red-500 bg-red-50 px-3 py-2 rounded-lg border border-red-200 w-full">
                        <ExclamationCircleIcon className="h-5 w-5 flex-shrink-0" />
                        <p className="text-sm">{errorMessage}</p>
                    </div>
                )}
            </div>

            <div className="text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href="/register" className="font-medium text-blue-600 hover:text-blue-700 hover:underline">
                    Register here
                </Link>
            </div>
        </form>
    );
}

function LoginButton() {
    const { pending } = useFormStatus();

    return (
        <button
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-3 text-sm font-semibold text-white hover:from-blue-700 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:transform-none"
            aria-disabled={pending}
            disabled={pending}
        >
            {pending ? (
                <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Logging in...</span>
                </>
            ) : (
                <>
                    <span>Log in</span>
                    <ArrowRightIcon className="h-5 w-5" />
                </>
            )}
        </button>
    );
}
