import { HOST } from '@configs/env';
import { generateSitemapXML } from '@libs/utils/generate-sitemap';
import { GetServerSidePropsContext } from 'next';
import { format } from 'date-fns';
import { GeneralClient } from '@libs/client/General';
export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const generalClient = new GeneralClient(ctx, {});

  try {
    const drugstores = await generalClient.getMenu();
    const allUrls: string[] = [];

    if (
      drugstores.data &&
      drugstores.data?.length > 0 &&
      drugstores.status == 'OK'
    ) {
      drugstores.data.map((el) => {
        const productTypeUrl = `${HOST}/${el.seoUrl}`;
        const listGroup = el?.productGroups;
        listGroup?.forEach((dataGroup) => {
          allUrls.push(`${productTypeUrl}/${dataGroup.seoUrl}`);

          dataGroup?.productTypeGroup?.map((_el) =>
            allUrls.push(`${productTypeUrl}/${_el.seoUrl}`)
          );
        });
      });
      const dataSitemap = generateSitemapXML(
        allUrls,
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
