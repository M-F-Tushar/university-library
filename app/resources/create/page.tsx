import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import CreateResourceForm from '@/app/ui/resources/create-form';

export default async function CreateResourcePage() {
    const session = await auth();
    // @ts-ignore
    if (!session || session.user?.role !== 'ADMIN') {
        redirect('/dashboard');
    }

    return (
        <main className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Upload New Resource</h1>
            <CreateResourceForm />
        </main>
    );
}
