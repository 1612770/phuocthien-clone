import { HOST } from '@configs/env';
import { generateSiteMapIdx } from '@libs/utils/generate-sitemap';
import { GetServerSidePropsContext } from 'next';
export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const sitemapIdxUrls = [
    `${HOST}/sitemap-about-nhathuocphuocthien.xml`,
    `${HOST}/sitemap-baiviet.xml`,
    `${HOST}/sitemap-chuyenmucchinh.xml`,
    `${HOST}/sitemap-chuyenmucweb.xml`,
    `${HOST}/sitemap-mathang.xml`,
  ];

  const dataSitemap = generateSiteMapIdx(sitemapIdxUrls);
  ctx.res.setHeader('Content-Type', 'application/xml');
  ctx.res.write(dataSitemap);
  ctx.res.end();

  return { props: {} };
}
const SiteMap = () => null;
export default SiteMap;
