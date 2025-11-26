import { auth } from '@/auth';
import AdminDashboard from '@/app/ui/dashboard/admin-dashboard';
import StudentDashboard from '@/app/ui/dashboard/student-dashboard';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user) {
        redirect('/login');
    }

    const role = session.user.role;

    return (
        <main className="p-6">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <p className="mb-4">Welcome back, {session.user.name}!</p>

            {role === 'ADMIN' ? <AdminDashboard /> : <StudentDashboard />}
        </main>
    );
}
