import MagicLinkForm from '@/app/ui/magic-link-form';
import { BookOpenIcon } from '@heroicons/react/24/outline';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import Link from 'next/link';

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string }>;
}) {
    const session = await auth();
    const params = await searchParams;

    // If user is already logged in, redirect based on role
    if (session?.user) {
        if (session.user.role === 'ADMIN') {
            redirect('/admin/dashboard');
        } else {
            redirect('/');
        }
    }

    const siteName = await prisma.siteSettings.findUnique({ where: { key: 'site_name' } });
    const allowedDomain = await prisma.siteSettings.findUnique({ where: { key: 'allowed_email_domain' } });

    const errorMessages: Record<string, string> = {
        'missing-token': 'Login link is invalid. Please request a new one.',
        'invalid-token': 'Login link has expired. Please request a new one.',
    };

    const errorMessage = params.error ? errorMessages[params.error] || params.error : null;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-violet-50 to-purple-50 p-4">
            <div className="relative w-full max-w-md">
                {/* Decorative elements */}
                <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-gradient-to-br from-blue-400/20 to-violet-400/20 blur-3xl"></div>
                <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-gradient-to-br from-violet-400/20 to-purple-400/20 blur-3xl"></div>

                <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-violet-600 p-8 text-white">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                                <BookOpenIcon className="h-7 w-7" />
                            </div>
                            <h1 className="text-2xl font-bold">{siteName?.value || 'UniLibrary'}</h1>
                        </div>
                        <p className="text-blue-100">Enter your university email to log in</p>
                    </div>

                    {/* Error message */}
                    {errorMessage && (
                        <div className="px-8 pt-6">
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {errorMessage}
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    <div className="p-8">
                        <MagicLinkForm allowedDomain={allowedDomain?.value || '@university.edu'} />

                        {/* Admin login link */}
                        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                            <p className="text-sm text-gray-500">
                                Admin?{' '}
                                <Link href="/admin/login" className="text-blue-600 hover:underline font-medium">
                                    Login with password
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
