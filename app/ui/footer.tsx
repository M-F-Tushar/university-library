import Link from 'next/link';
import { BookOpenIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline';
import prisma from '@/lib/prisma';

export default async function Footer() {
    const [siteName, siteDescription, contactAddress, contactEmail, footerCopyright, categories] = await Promise.all([
        prisma.siteSettings.findUnique({ where: { key: 'site_name' } }),
        prisma.siteSettings.findUnique({ where: { key: 'site_description' } }),
        prisma.siteSettings.findUnique({ where: { key: 'contact_address' } }),
        prisma.siteSettings.findUnique({ where: { key: 'contact_email' } }),
        prisma.siteSettings.findUnique({ where: { key: 'footer_copyright' } }),
        prisma.category.findMany({ where: { isActive: true }, orderBy: { order: 'asc' }, take: 5 }),
    ]);

    return (
        <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white border-t border-slate-800">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12" suppressHydrationWarning>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8" suppressHydrationWarning>
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2" suppressHydrationWarning>
                        <div className="flex items-center gap-2 mb-4" suppressHydrationWarning>
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 shadow-lg" suppressHydrationWarning>
                                <BookOpenIcon className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold">{siteName?.value || 'CS Lib'}</span>
                        </div>
                        <p className="text-slate-400 mb-4 max-w-md">
                            {siteDescription?.value || 'Your dedicated digital library for Computer Science resources.'}
                        </p>
                        <div className="space-y-2 text-sm text-slate-400" suppressHydrationWarning>
                            <div className="flex items-center gap-2" suppressHydrationWarning>
                                <MapPinIcon className="h-4 w-4" />
                                <span>{contactAddress?.value || 'University Campus'}</span>
                            </div>
                            <div className="flex items-center gap-2" suppressHydrationWarning>
                                <EnvelopeIcon className="h-4 w-4" />
                                <span>{contactEmail?.value || 'library@university.edu'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div suppressHydrationWarning>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-slate-400">
                            <li>
                                <Link href="/" className="hover:text-white transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/resources" className="hover:text-white transition-colors">
                                    Browse Resources
                                </Link>
                            </li>
                            <li>
                                <Link href="/courses" className="hover:text-white transition-colors">
                                    Courses
                                </Link>
                            </li>
                            <li>
                                <Link href="/external-resources" className="hover:text-white transition-colors">
                                    External Resources
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="hover:text-white transition-colors">
                                    About
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources - Dynamic from Database */}
                    <div suppressHydrationWarning>
                        <h3 className="text-lg font-semibold mb-4">Resources</h3>
                        <ul className="space-y-2 text-slate-400">
                            {categories.map((category) => (
                                <li key={category.id}>
                                    <Link href={`/resources?category=${category.name}`} className="hover:text-white transition-colors">
                                        {category.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-slate-700 text-center" suppressHydrationWarning>
                    <p className="text-sm text-slate-400">
                        © {new Date().getFullYear()} {footerCopyright?.value || 'University Library'}. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
