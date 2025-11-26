import { auth, signOut } from '@/auth';
import { UserCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export default async function AdminHeader() {
    const session = await auth();

    return (
        <header className="bg-white border-b border-gray-200 px-8 py-4" suppressHydrationWarning>
            <div className="flex items-center justify-between" suppressHydrationWarning>
                <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        Welcome Back
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Manage your university library system
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100">
                        <UserCircleIcon className="h-6 w-6 text-purple-600" />
                        <div>
                            <p className="text-sm font-semibold text-gray-900">{session?.user?.name}</p>
                            <p className="text-xs text-gray-500">{session?.user?.role}</p>
                        </div>
                    </div>

                    <form
                        action={async () => {
                            'use server';
                            await signOut({ redirectTo: '/admin/login' });
                        }}
                    >
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-medium hover:from-gray-200 hover:to-gray-300 transition-all shadow-sm hover:shadow"
                        >
                            <ArrowRightOnRectangleIcon className="h-5 w-5" />
                            Sign Out
                        </button>
                    </form>
                </div>
            </div>
        </header>
    );
}
