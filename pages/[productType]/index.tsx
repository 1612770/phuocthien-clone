import PrimaryLayout from 'components/layouts/PrimaryLayout';
import { Empty, Typography } from 'antd';
import { NextPageWithLayout } from 'pages/page';
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import { GeneralClient } from '@libs/client/General';
import MenuModel from '@configs/models/menu.model';
import ProductGroup from '@modules/categories/ProductGroup';
import Breadcrumbs from '@components/Breadcrumbs';

const ProductTypesPage: NextPageWithLayout<{
  productType?: MenuModel;
}> = ({ productType }) => {
  return (
    <div className="grid px-4 pb-4 lg:container lg:px-0">
      <Breadcrumbs
        className="mt-4 mb-2"
        breadcrumbs={[
          {
            title: 'Trang chủ',
            path: '/',
          },
          {
            title: productType?.name,
          },
        ]}
      ></Breadcrumbs>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6 md:gap-4 lg:grid-cols-6 xl:grid-cols-8">
        {productType?.productGroups?.map((productGroup) => (
          <ProductGroup
            key={productGroup?.key}
            productGroup={productGroup}
            href={`/${productType.seoUrl}/${productGroup?.seoUrl}`}
          />
        ))}
      </div>

      {!productType?.productGroups?.length && (
        <div className="flex min-h-[400px] w-full items-center justify-center py-8">
          <Empty
            description={<Typography>Không tìm thấy danh mục nào</Typography>}
          ></Empty>
        </div>
      )}
    </div>
  );
};

export default ProductTypesPage;

ProductTypesPage.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const generalClient = new GeneralClient(null, {});

  const fullMenu = await generalClient.getMenu();
  const paths = (fullMenu.data || []).map((menu) => {
    return {
      params: {
        productType: menu.seoUrl,
      },
    };
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const staticProps: {
    props: {
      productType?: MenuModel;
    };
  } = {
    props: {},
  };

  const generalClient = new GeneralClient(null, {});
  try {
    const fullMenu = await generalClient.getMenu();
    const productType = (fullMenu.data || []).find((menu) => {
      return menu.seoUrl === context.params?.productType;
    });

    staticProps.props.productType = productType;
  } catch (error) {
    console.error(error);
  }

  return staticProps;
};
