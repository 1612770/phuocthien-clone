import PrimaryLayout from '@components/layouts/PrimaryLayout';
import { NextPageWithLayout } from './page';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import { CmsClient } from '@libs/client/Cms';
import { Article } from '@configs/models/cms.model';
import { GeneralPageDetail } from '@modules/general-page/GeneralPage';
import PagePropsWithSeo from '@configs/types/page-props-with-seo';
interface GeneralPageProps extends PagePropsWithSeo {
  page: Article;
}
export const getStaticProps = async (context: GetStaticPropsContext) => {
  const staticProps: ReturnType<GetStaticProps<GeneralPageProps>> = {
    props: {
      page: {} as Article,
      SEOData: {},
    },
    revalidate: 86400, // 1 hour
  };

  const cmsClient = new CmsClient(context, {});
  try {
    const res = await cmsClient.getArticles({
      q: { type: 'PAGE', slug: 'chinh-sach-bao-mat' },
    });
    if (res.status === 'OK' && res.data && res.data?.length > 0) {
      staticProps.props.page = res.data[0];
      staticProps.props.SEOData.titleSeo = res.data[0].seoData.title;
      staticProps.props.SEOData.keywordSeo = res.data[0].seoData.keywords;
      staticProps.props.SEOData.metaSeo = res.data[0].seoData.description;
    }
  } catch (error) {
    console.error(error);
  }
  return staticProps;
};

const GeneralPage: NextPageWithLayout<GeneralPageProps> = ({ page }) => {
  return <GeneralPageDetail page={page} />;
};

export default GeneralPage;

GeneralPage.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
