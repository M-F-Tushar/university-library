import Link from 'next/link';

export default function NotFound() {
    return (
        <main className="flex h-full flex-col items-center justify-center gap-2 py-20">
            <h2 className="text-xl font-semibold">Resource Not Found</h2>
            <p>Could not find the requested resource.</p>
            <Link
                href="/resources"
                className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
            >
                Browse Resources
            </Link>
        </main>
    );
}
