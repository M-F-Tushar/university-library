import { auth } from '@/auth';
import { MainNav } from '@/components/navigation/MainNav';
import prisma from '@/lib/prisma';

export default async function Navbar() {
    const session = await auth();
    const siteName = await prisma.siteSettings.findUnique({ where: { key: 'site_name' } });
    return <MainNav session={session} siteName={siteName?.value || 'CS Lib'} />;
}
