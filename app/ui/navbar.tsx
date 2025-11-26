import { auth } from '@/auth';
import NavbarContent from './navbar-content';
import prisma from '@/lib/prisma';

export default async function Navbar() {
    const session = await auth();
    const siteName = await prisma.siteSettings.findUnique({ where: { key: 'site_name' } });
    return <NavbarContent session={session} siteName={siteName?.value || 'CS Lib'} />;
}
