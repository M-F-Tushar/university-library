import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXTAUTH_URL || 'https://library.example.com'
    
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/admin/',
                    '/api/',
                    '/dashboard/settings/',
                    '/login',
                    '/register',
                    '/_next/',
                    '/uploads/temp/',
                ],
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
                disallow: [
                    '/admin/',
                    '/api/',
                    '/dashboard/settings/',
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
