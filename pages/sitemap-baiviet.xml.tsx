import { HOST } from '@configs/env';
import { generateSiteMapIdx } from '@libs/utils/generate-sitemap';
import { GetServerSidePropsContext } from 'next';
import { CmsClient } from '@libs/client/Cms';
export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const clientProduct = new CmsClient(ctx, {});
  try {
    const drugstores = await clientProduct.getArticles({
      q: { type: 'BLOG' },
      getTotal: true,
    });
    if (
      drugstores.data &&
      drugstores.data?.length > 0 &&
      drugstores.status == 'OK'
    ) {
      const urls = [];
      const totalBlogs = Math.ceil(+(drugstores?.total || 0) / 20);
      for (let i = 0; i < totalBlogs; i++) {
        urls.push(`${HOST}/sitemap-baivietdata.xml?page=${i + 1}`);
      }
      const dataSitemap = generateSiteMapIdx(urls);
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
