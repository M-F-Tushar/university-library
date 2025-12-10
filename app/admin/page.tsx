import { redirect } from 'next/navigation';

/**
 * Admin root page - redirects to dashboard
 * This prevents 404 when navigating to /admin
 */
export default function AdminPage() {
    redirect('/admin/dashboard');
}
