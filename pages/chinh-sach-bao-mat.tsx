import PrimaryLayout from '@components/layouts/PrimaryLayout';
import { NextPageWithLayout } from './page';
import { GetServerSidePropsContext } from 'next';
import { CmsClient } from '@libs/client/Cms';
import { Article } from '@configs/models/cms.model';
import { GeneralPageDetail } from '@modules/general-page/GeneralPage';
import PagePropsWithSeo from '@configs/types/page-props-with-seo';
interface GeneralPageProps extends PagePropsWithSeo {
  page: Article;
}
export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const serverSideProps: {
    props: GeneralPageProps;
  } = {
    props: {
      page: {} as Article,
      SEOData: {},
    },
  };
  const currentSlug = context.resolvedUrl.split('/')[1];
  const cmsClient = new CmsClient(context, {});
  try {
    const res = await cmsClient.getArticles({
      q: { type: 'PAGE', slug: currentSlug },
    });
    if (res.status === 'OK' && res.data && res.data?.length > 0) {
      serverSideProps.props.page = res.data[0];
      serverSideProps.props.SEOData.titleSeo = res.data[0].seoData.title;
      serverSideProps.props.SEOData.keywordSeo = res.data[0].seoData.keywords;
      serverSideProps.props.SEOData.metaSeo = res.data[0].seoData.description;
    }
  } catch (error) {
    console.error(error);
  }
  return serverSideProps;
};

const GeneralPage: NextPageWithLayout<GeneralPageProps> = ({ page }) => {
  return <GeneralPageDetail page={page} />;
};

export default GeneralPage;

GeneralPage.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
