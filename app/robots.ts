import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
              '/dashboard/',
              '/admin/',
              '/calculator/',
              '/guide/',
              '/disease-codes/',
              '/contacts/',
              '/claim/'
            ],
        },
        sitemap: 'https://stroy.kr/sitemap.xml',
    }
}
