import { HOST } from '@configs/env';
import { generateSitemapXML } from '@libs/utils/generate-sitemap';
import { GetServerSidePropsContext } from 'next';
import { format } from 'date-fns';
export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const pagesAbout = [
    `${HOST}/gioi-thieu-nha-thuoc-phuoc-thien`,
    `${HOST}/quy-che-hoat-dong-website`,
    `${HOST}/he-thong-cac-cua-hang`,
    `${HOST}/chinh-sach-doi-tra`,
    `${HOST}/chinh-sach-giao-hang`,
    `${HOST}/chinh-sach-kiem-hang`,
    `${HOST}/chinh-sach-thanh-toan`,
    `${HOST}/chinh-sach-tich-diem`,
    `${HOST}/chinh-sach-bao-mat`,
  ];

  const dataSitemap = generateSitemapXML(
    pagesAbout,
    0.6,
    'weekly',
    format(new Date(), 'yyyy-MM-dd'),
    `<url>
            <loc>${HOST}</loc>
            <lastmod>${format(new Date(), 'yyyy-MM-dd')}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>1.0</priority>
        </url>`
  );
  ctx.res.setHeader('Content-Type', 'application/xml');
  ctx.res.write(dataSitemap);
  ctx.res.end();

  return { props: {} };
}
const SiteMap = () => null;
export default SiteMap;
