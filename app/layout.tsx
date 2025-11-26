import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/ui/navbar";
import Footer from "@/app/ui/footer";
import prisma from "@/lib/prisma";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const [siteTitle, siteMetaDescription] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { key: 'site_title' } }),
    prisma.siteSettings.findUnique({ where: { key: 'site_meta_description' } }),
  ]);

  return {
    title: siteTitle?.value || "CS Student Library",
    description: siteMetaDescription?.value || "Resources, code snippets, and algorithms for Computer Science students.",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 min-h-screen flex flex-col`} suppressHydrationWarning>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
