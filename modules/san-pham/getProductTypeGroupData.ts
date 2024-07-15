import PRODUCTS_LOAD_PER_TIME from '@configs/constants/products-load-per-time';
import BrandModel from '@configs/models/brand.model';
import ProductGroupModel from '@configs/models/product-group.model';
import ProductTypeGroupModel from '@configs/models/product-type-group.model';
import ProductType from '@configs/models/product-type.model';
import Product from '@configs/models/product.model';
import WithPagination from '@configs/types/utils/with-pagination';
import { GeneralClient } from '@libs/client/General';
import { ProductClient } from '@libs/client/Product';

const getProductTypeGroupData = async ({
  productTypeSeoUrl,
  productTypeGroupSeoUrl,
}: {
  productTypeSeoUrl: string;
  productTypeGroupSeoUrl: string;
}) => {
  const productTypeGroupData: {
    productType?: ProductType;
    productTypeGroup?: ProductTypeGroupModel;
    productGroup?: ProductGroupModel;
    productBrands?: BrandModel[];
    products?: WithPagination<Product[]>;
  } = {};

  const generalClient = new GeneralClient(null, {});
  const productClient = new ProductClient(null, {});

  const [productType, productTypeGroup, productBrands] = await Promise.all([
    generalClient.getProductTypeDetail({
      seoUrl: productTypeSeoUrl,
    }),
    generalClient.getProductTypeGroupDetail({
      seoUrl: productTypeGroupSeoUrl,
    }),
    generalClient.getProductionBrands(),
  ]);
  if (!productType.data) {
    throw new Error('Không tìm thấy loại sản phẩm');
  }
  if (!productTypeGroup.data)
    throw new Error('Không tìm thấy loại nhóm sản phẩm');

  const filterTypeGroupData = productTypeGroup.data.find(
    (el) => el.seoProductTypeUrl === productType.data?.seoUrl
  );
  if (!filterTypeGroupData) {
    throw new Error('Không tìm thấy loại nhóm sản phẩm trong loại sản phẩm');
  }
  const productGroup = await generalClient.getProductGroupDetail({
    seoUrl: filterTypeGroupData.seoProductGroupUrl,
  });
  if (productGroup.data) {
    productTypeGroupData.productGroup = productGroup.data;
  }
  productTypeGroupData.productType = productType.data;
  productTypeGroupData.productTypeGroup = filterTypeGroupData;
  productTypeGroupData.productBrands = productBrands.data;

  const products = await productClient.getProducts({
    page: 1,
    pageSize: PRODUCTS_LOAD_PER_TIME,
    productTypeSeoUrl: productType.data?.seoUrl,
    productTypeGroupSeoUrl: filterTypeGroupData?.seoUrl,
    productionBrandKeys: undefined,
    sortBy: undefined,
    sortOrder: undefined,
    isPrescripted: undefined,
  });

  if (products.data) {
    productTypeGroupData.products = products.data;
  }

  return productTypeGroupData;
};

export default getProductTypeGroupData;
