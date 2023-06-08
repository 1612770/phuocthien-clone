import PrimaryLayout from 'components/layouts/PrimaryLayout';
import { NextPageWithLayout } from 'pages/page';
import { GetServerSidePropsContext } from 'next';
import { GeneralClient } from '@libs/client/General';
import MenuModel from '@configs/models/menu.model';
import EVENTS_LOAD_PER_TIME from '@configs/constants/events-load-per-time';
import GroupInfoModel from '@configs/models/GroupInfoModel';
import GroupInfoPage from '@modules/tin-tuc/danh-muc/GroupInfoPage';
import ProductTypePage from '@modules/san-pham/ProductTypePage';

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

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const serverSideProps: {
    props: {
      groupInfo: {
        groupInfo?: GroupInfoModel;
      };
      productType: {
        productType?: MenuModel;
      };
    };
  } = {
    props: {
      groupInfo: {},
      productType: {},
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

    if (groupInfos.data?.[0]) {
      serverSideProps.props.groupInfo.groupInfo = groupInfos.data?.[0];
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
