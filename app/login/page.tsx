import LoginForm from '@/app/ui/login-form';
import { BookOpenIcon } from '@heroicons/react/24/outline';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';

export default async function LoginPage() {
    const session = await auth();

    // If user is already logged in, redirect based on role
    if (session?.user) {
        if (session.user.role === 'ADMIN') {
            redirect('/admin/dashboard');
        } else {
            redirect('/');
        }
    }

    const siteName = await prisma.siteSettings.findUnique({ where: { key: 'site_name' } });

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-violet-50 to-purple-50 p-4" suppressHydrationWarning>
            <div className="relative w-full max-w-md" suppressHydrationWarning>
                {/* Decorative elements */}
                <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-gradient-to-br from-blue-400/20 to-violet-400/20 blur-3xl" suppressHydrationWarning></div>
                <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-gradient-to-br from-violet-400/20 to-purple-400/20 blur-3xl" suppressHydrationWarning></div>

                <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100" suppressHydrationWarning>
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-violet-600 p-8 text-white" suppressHydrationWarning>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                                <BookOpenIcon className="h-7 w-7" />
                            </div>
                            <h1 className="text-2xl font-bold">{siteName?.value || 'UniLibrary'}</h1>
                        </div>
                        <p className="text-blue-100">Welcome back! Please login to continue</p>
                    </div>

                    {/* Form */}
                    <div className="p-8">
                        <LoginForm />
                    </div>
                </div>
            </div>
        </div>
    );
}
