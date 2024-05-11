import { HOST } from '@configs/env';
import { generateSitemapXML } from '@libs/utils/generate-sitemap';
import { GetServerSidePropsContext } from 'next';
import { format } from 'date-fns';
import { GeneralClient } from '@libs/client/General';
export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const generalClient = new GeneralClient(ctx, {});

  try {
    const drugstores = await generalClient.getMenu();
    if (
      drugstores.data &&
      drugstores.data?.length > 0 &&
      drugstores.status == 'OK'
    ) {
      const urlsMainCategory = drugstores.data.map(
        (el) => `${HOST}/${el.seoUrl}`
      );
      const dataSitemap = generateSitemapXML(
        urlsMainCategory,
        0.9,
        'weekly',
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
