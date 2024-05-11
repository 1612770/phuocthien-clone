import { format } from 'date-fns';

export const generateSitemapXML = (
  urls: string[],
  priority: number,
  changeFreq: string,
  lastMod?: string,
  priorityHost?: string
) => {
  let xml = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
  if (priorityHost) {
    xml += priorityHost;
  }
  urls.forEach((item) => {
    xml += `<url>
            <loc>${item}</loc>
            <lastmod>${lastMod}</lastmod>
            <changefreq>${changeFreq}</changefreq>
            <priority>${priority}</priority>
        </url>`;
  });
  xml += `</urlset>`;
  return xml;
};
export const generateSiteMapIdx = (urls: string[]) => {
  let xml = `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
  urls.forEach((url) => {
    xml += `<sitemap>
      <loc>${url}</loc>
      <lastmod>${format(new Date(), 'yyyy-MM-dd')}</lastmod>
    </sitemap>`;
  });
  xml += `</sitemapindex>`;
  return xml;
};
