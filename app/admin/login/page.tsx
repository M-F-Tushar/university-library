import AdminLoginForm from '@/app/ui/admin/admin-login-form';
import { BookOpenIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';

export default async function AdminLoginPage() {
    const session = await auth();

    // If user is already logged in as admin, redirect to dashboard
    if (session?.user?.role === 'ADMIN') {
        redirect('/admin/dashboard');
    }

    const siteName = await prisma.siteSettings.findUnique({ where: { key: 'site_name' } });

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
            <div className="relative w-full max-w-md">
                {/* Decorative elements */}
                <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl"></div>
                <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl"></div>

                <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/20">
                    {/* Header */}
                    <div className="p-8 text-white text-center">
                        <div className="flex justify-center mb-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                                <ShieldCheckIcon className="h-8 w-8" />
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <BookOpenIcon className="h-6 w-6" />
                            <h1 className="text-2xl font-bold">{siteName?.value || 'UniLibrary'}</h1>
                        </div>
                        <p className="text-purple-200">Admin Portal</p>
                    </div>

                    {/* Form */}
                    <div className="p-8 pt-0">
                        <AdminLoginForm />
                    </div>
                </div>
            </div>
        </div>
    );
}
