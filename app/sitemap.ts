import { MetadataRoute } from 'next';

const BASE_URL = 'https://toriplanen.de';

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ['de', 'en', 'hi'];
  const currentDate = new Date();

  // Main pages
  const mainPages = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '/referenzen', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/impressum', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/datenschutz', priority: 0.3, changeFrequency: 'yearly' as const },
  ];

  // Product/Service pages - these are your main SEO targets
  const productPages = [
    { path: '/pvc-planen', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/geruestplanen', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/kederplanen', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/staubschutznetze', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/strahlschutznetze', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/personenauffangnetze', priority: 0.9, changeFrequency: 'weekly' as const },
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Generate entries for each locale
  for (const locale of locales) {
    // Main pages
    for (const page of mainPages) {
      sitemapEntries.push({
        url: `${BASE_URL}/${locale}${page.path}`,
        lastModified: currentDate,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: {
          languages: {
            'de': `${BASE_URL}/de${page.path}`,
            'en': `${BASE_URL}/en${page.path}`,
            'hi': `${BASE_URL}/hi${page.path}`,
          },
        },
      });
    }

    // Product pages (when you create them)
    for (const page of productPages) {
      sitemapEntries.push({
        url: `${BASE_URL}/${locale}${page.path}`,
        lastModified: currentDate,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: {
          languages: {
            'de': `${BASE_URL}/de${page.path}`,
            'en': `${BASE_URL}/en${page.path}`,
            'hi': `${BASE_URL}/hi${page.path}`,
          },
        },
      });
    }
  }

  return sitemapEntries;
}
