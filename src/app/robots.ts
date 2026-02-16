import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://qrtag.pro'

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/dashboard/', '/scan/', '/admin/'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
