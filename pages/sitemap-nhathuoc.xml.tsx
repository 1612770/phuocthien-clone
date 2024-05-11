import { HOST } from '@configs/env';
import { DrugstoreClient } from '@libs/client/DrugStore';
import { generateSitemapXML } from '@libs/utils/generate-sitemap';
import { GetServerSidePropsContext } from 'next';
import { format } from 'date-fns';
export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const drugstoreClient = new DrugstoreClient(ctx, {});

  try {
    const drugstores = await drugstoreClient.getAllDrugStores();
    if (
      drugstores.data &&
      drugstores.data?.length > 0 &&
      drugstores.status == 'OK'
    ) {
      const urlsDrugstore = drugstores.data.map(
        (el) => `${HOST}/nha-thuoc/${el.key}`
      );
      const dataSitemap = generateSitemapXML(
        [`${HOST}/nhathuoc`, ...urlsDrugstore],
        0.6,
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
