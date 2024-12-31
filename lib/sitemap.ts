import crypto from 'crypto';
import { XMLParser } from 'fast-xml-parser';
import { z } from 'zod';

const sitemapUrlSchema = z.object({
  loc: z.string().url(),
  lastmod: z.string().optional(),
  changefreq: z.string().optional(),
  priority: z.number().optional(),
});

const sitemapSchema = z.object({
  urlset: z.object({
    url: z.array(sitemapUrlSchema),
  }),
});

const sitemapIndexSchema = z.object({
  sitemapindex: z.object({
    sitemap: z.array(
      z.object({
        loc: z.string().url(),
        lastmod: z.string().optional(),
      }),
    ),
  }),
});

export type SitemapUrl = z.infer<typeof sitemapUrlSchema>;
export type Sitemap = z.infer<typeof sitemapSchema>;
export type SitemapIndex = z.infer<typeof sitemapIndexSchema>;

export async function fetchSitemap(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch sitemap: ${response.statusText}`);
  }
  return await response.text();
}

export function parseSitemap(content: string) {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
    parseTagValue: true,
    trimValues: true,
    isArray: (name, jpath, isLeafNode, isAttribute) => {
      // Always treat url and sitemap tags as arrays
      return name === 'url' || name === 'sitemap';
    },
  });
  const parsed = parser.parse(content);

  // Try parsing as sitemap index first
  try {
    const index = sitemapIndexSchema.parse(parsed);
    return { type: 'index' as const, data: index };
  } catch {
    // If not a sitemap index, try parsing as regular sitemap
    try {
      const sitemap = sitemapSchema.parse(parsed);
      return { type: 'sitemap' as const, data: sitemap };
    } catch (error) {
      throw new Error('Invalid sitemap format');
    }
  }
}

export function generateSitemapHash(content: string): string {
  return crypto.createHash('sha256').update(content).digest('hex');
}
