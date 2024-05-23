import { HOST } from '@configs/env';
import { generateSiteMapIdx } from '@libs/utils/generate-sitemap';
import { GetServerSidePropsContext } from 'next';
import { ProductClient } from '@libs/client/Product';
export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const clientProduct = new ProductClient(ctx, {});
  try {
    const drugstores = await clientProduct.getProducts({
      page: 1,
      pageSize: 20,
    });
    if (
      drugstores.data?.totalPage &&
      drugstores.data?.total > 0 &&
      drugstores.status == 'OK'
    ) {
      const urls = [];
      for (let i = 0; i < drugstores.data.totalPage; i++) {
        urls.push(`${HOST}/sitemap-sanpham.xml?page=${i + 1}`);
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
