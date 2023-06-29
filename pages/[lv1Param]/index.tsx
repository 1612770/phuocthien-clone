import PrimaryLayout from 'components/layouts/PrimaryLayout';
import { NextPageWithLayout } from 'pages/page';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { GeneralClient } from '@libs/client/General';
import MenuModel from '@configs/models/menu.model';
import EVENTS_LOAD_PER_TIME from '@configs/constants/events-load-per-time';
import GroupInfoModel from '@configs/models/GroupInfoModel';
import GroupInfoPage from '@modules/tin-tuc/danh-muc/GroupInfoPage';
import ProductTypePage from '@modules/san-pham/ProductTypePage';
import PagePropsWithSeo from '@configs/types/page-props-with-seo';

const ProductTypesPage: NextPageWithLayout<{
  productType: { productType?: MenuModel };
  groupInfo: {
    groupInfo?: GroupInfoModel;
  };
}> = ({ productType, groupInfo }) => {
  if (groupInfo.groupInfo?.key) {
    return <GroupInfoPage groupInfo={groupInfo.groupInfo} />;
  }

  return (
    <ProductTypePage
      productTypeSeoUrlToGetFromFullMenu={productType.productType?.seoUrl}
    />
  );
};

export default ProductTypesPage;

ProductTypesPage.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};

interface PageProps extends PagePropsWithSeo {
  groupInfo: {
    groupInfo?: GroupInfoModel;
  };
  productType: {
    productType?: MenuModel;
  };
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context: GetServerSidePropsContext
) => {
  const serverSideProps: {
    props: PageProps;
  } = {
    props: {
      groupInfo: {},
      productType: {},
      SEOData: {},
    },
  };

  const lv1ParamSeoUrl = context.params?.lv1Param as string;

  const generalClient = new GeneralClient(context, {});

  try {
    const groupInfos = await generalClient.getGroupInfos({
      page: +(context.query.trang || 1),
      pageSize: EVENTS_LOAD_PER_TIME,
      groupSeoUrl: lv1ParamSeoUrl,
    });

    const groupData = groupInfos.data?.[0];

    if (groupData) {
      serverSideProps.props.groupInfo.groupInfo = groupData;
      serverSideProps.props.SEOData.titleSeo = groupData.titleSeo;
      serverSideProps.props.SEOData.metaSeo = groupData.metaSeo;
      serverSideProps.props.SEOData.keywordSeo = groupData.keywordSeo;
    } else {
      throw new Error('Không tìm thấy groupInfo');
    }
  } catch (error) {
    try {
      const productType = await generalClient.getProductTypeDetail({
        seoUrl: lv1ParamSeoUrl,
      });

      if (productType.data) {
        serverSideProps.props.productType.productType = productType.data;
        serverSideProps.props.SEOData.titleSeo = productType.data.titleSeo;
        serverSideProps.props.SEOData.metaSeo = productType.data.metaSeo;
        serverSideProps.props.SEOData.keywordSeo = productType.data.keywordSeo;
      } else {
        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        };
      }
    } catch (error) {
      console.error('getProductTypeDetail', error);
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    console.error('getGroupInfos', error);
  }

  return serverSideProps;
};
