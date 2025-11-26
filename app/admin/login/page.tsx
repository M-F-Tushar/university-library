import { redirect } from 'next/navigation';

export default function AdminLogin() {
    // Redirect admins to the standard login page
    redirect('/login');
    return null;
}
