import type { Metadata, Viewport } from "next";
import "./styles.css";
import Navbar from "@/app/ui/navbar";
import Footer from "@/app/ui/footer";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SkipLink } from "@/components/accessibility/SkipLink";
import { RouteAnnouncer } from "@/components/accessibility/RouteAnnouncer";
import { ToastProvider } from "@/components/ui/Toast";
import prisma from "@/lib/prisma";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1f2937' },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const [siteTitle, siteMetaDescription] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { key: 'site_title' } }),
    prisma.siteSettings.findUnique({ where: { key: 'site_meta_description' } }),
  ]);

  const title = siteTitle?.value || "CS Student Library";
  const description = siteMetaDescription?.value || "Resources, code snippets, and algorithms for Computer Science students.";

  return {
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description,
    keywords: ['computer science', 'programming', 'algorithms', 'data structures', 'university', 'library', 'resources'],
    authors: [{ name: 'CS Student Library Team' }],
    creator: 'CS Student Library',
    publisher: 'CS Student Library',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      siteName: title,
      title,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    manifest: '/manifest.json',
    icons: {
      icon: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-50 min-h-screen flex flex-col antialiased font-sans" suppressHydrationWarning>
        <ToastProvider>
          <SkipLink />
          <RouteAnnouncer />
          <Navbar />
          <main id="main-content" className="flex-1 container mx-auto px-4 py-6 focus:outline-none" tabIndex={-1}>
            <Breadcrumbs />
            {children}
          </main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
