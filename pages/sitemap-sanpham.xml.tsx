import { HOST } from '@configs/env';
import { generateSitemapXML } from '@libs/utils/generate-sitemap';
import { GetServerSidePropsContext } from 'next';
import { format } from 'date-fns';
import { ProductClient } from '@libs/client/Product';
export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const clientProduct = new ProductClient(ctx, {});
  const page = +(ctx.query?.page || 1);
  try {
    const drugstores = await clientProduct.getProducts({
      page: page,
      pageSize: 20,
    });
    if (
      drugstores.data?.totalPage &&
      drugstores.data?.total > 0 &&
      drugstores.status == 'OK'
    ) {
      const products = drugstores.data?.data;
      const urls = products.map(
        (product) =>
          `${HOST}/${product.productType?.seoUrl}/${product.detail?.seoUrl}`
      );
      const dataSitemap = generateSitemapXML(
        urls,
        0.9,
        'daily',
        format(new Date(), 'yyyy-MM-dd')
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
