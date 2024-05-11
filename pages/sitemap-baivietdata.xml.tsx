import { HOST } from '@configs/env';
import { generateSitemapXML } from '@libs/utils/generate-sitemap';
import { GetServerSidePropsContext } from 'next';
import { CmsClient } from '@libs/client/Cms';
import { format } from 'date-fns';
export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const clientProduct = new CmsClient(ctx, {});
  const page = +(ctx.query?.page || 0) - 1;
  try {
    const drugstores = await clientProduct.getArticles({
      q: { type: 'BLOG' },
      offset: page * 20,
      limit: 20,
      getTotal: true,
    });
    if (drugstores.data && drugstores.status == 'OK') {
      const urls = drugstores.data.map((el) => `${HOST}/bai-viet/${el.slug}`);
      const dataSitemap = generateSitemapXML(
        urls,
        0.8,
        'daily',
        format(new Date(), 'yyyy-MM-dd'),
        `<url>
            <loc>${HOST}/bai-viet</loc>
            <lastmod>${format(new Date(), 'yyyy-MM-dd')}</lastmod>
            <changefreq>daily</changefreq>
            <priority>1.0</priority>
        </url>`
      );
      ctx.res.setHeader('Content-Type', 'application/xml');
      ctx.res.write(dataSitemap);
      ctx.res.end();
    }
  } catch (error) {
    console.error(error);
  }
  return { props: {} };
}
const SiteMap = () => null;
export default SiteMap;
