import PrimaryLayout from 'components/layouts/PrimaryLayout/PrimaryLayout';
import { Breadcrumb, Space } from 'antd';
import { NextPageWithLayout } from 'pages/page';
import ProductGroup from '@modules/categories/ProductGroup';

const CategoriesPage: NextPageWithLayout = () => {
  return (
    <div className="container pb-4">
      <Breadcrumb className="mt-4 mb-2">
        <Breadcrumb.Item href="/">Trang chủ</Breadcrumb.Item>
        <Breadcrumb.Item>Dược, mỹ phẩm</Breadcrumb.Item>
      </Breadcrumb>

      <img
        className="mb-4 block aspect-video max-h-[240px] w-full object-cover"
        src="https://phuocthien.vn/Images/ImageUpload/2022-11/TOCDE.png"
        alt="banner image"
      />

      <Space size={[8, 8]} wrap>
        <ProductGroup />
        <ProductGroup />
        <ProductGroup />
        <ProductGroup />
        <ProductGroup />
        <ProductGroup />
        <ProductGroup />
        <ProductGroup />
        <ProductGroup />
        <ProductGroup />
        <ProductGroup />
        <ProductGroup />
        <ProductGroup />
        <ProductGroup />
        <ProductGroup />
        <ProductGroup />
      </Space>
    </div>
  );
};

export default CategoriesPage;

CategoriesPage.getLayout = (page) => {
  return <PrimaryLayout hideFooter>{page}</PrimaryLayout>;
};
