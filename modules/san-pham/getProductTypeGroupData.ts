import PRODUCTS_LOAD_PER_TIME from '@configs/constants/products-load-per-time';
import BrandModel from '@configs/models/brand.model';
import ProductGroupModel from '@configs/models/product-group.model';
import ProductTypeGroupModel from '@configs/models/product-type-group.model';
import ProductType from '@configs/models/product-type.model';
import Product from '@configs/models/product.model';
import WithPagination from '@configs/types/utils/with-pagination';
import { GeneralClient } from '@libs/client/General';
import { ProductClient } from '@libs/client/Product';
import { GetServerSidePropsContext } from 'next';

const getProductTypeGroupData = async (context: GetServerSidePropsContext) => {
  const productTypeGroupData: {
    productType?: ProductType;
    productTypeGroup?: ProductTypeGroupModel;
    productGroup?: ProductGroupModel;
    productBrands?: BrandModel[];
    products?: WithPagination<Product[]>;
  } = {};

  const generalClient = new GeneralClient(null, {});
  const productClient = new ProductClient(null, {});
  const lv2ParamSeoUrl = context.params?.lv2Param as string;
  const lv1ParamSeoUrl = context.params?.lv1Param as string;

  const [productType, productTypeGroup, productBrands] = await Promise.all([
    generalClient.getProductTypeDetail({
      seoUrl: lv1ParamSeoUrl,
    }),
    generalClient.getProductTypeGroupDetail({
      seoUrl: lv2ParamSeoUrl,
    }),
    generalClient.getProductionBrands(),
  ]);
  if (!productType.data) {
    throw new Error('Không tìm thấy loại sản phẩm');
  }
  if (!productTypeGroup.data)
    throw new Error('Không tìm thấy loại nhóm sản phẩm');
  if (productTypeGroup.data.productTypeKey != productType.data.key) {
    throw new Error('Không tìm thấy loại nhóm sản phẩm trong loại sản phẩm');
  }
  const productGroup = await generalClient.getProductGroupDetail({
    seoUrl: productTypeGroup.data.seoProductGroupUrl,
  });
  if (productGroup.data) {
    productTypeGroupData.productGroup = productGroup.data;
  }
  productTypeGroupData.productType = productType.data;
  productTypeGroupData.productTypeGroup = productTypeGroup.data;
  productTypeGroupData.productBrands = productBrands.data;
  const filterIsPrescripted =
    (context.query['thuoc-ke-don'] as string) || 'ALL';
  const products = await productClient.getProducts({
    page: context.query.trang ? Number(context.query.trang) : 1,
    pageSize: PRODUCTS_LOAD_PER_TIME,
    productTypeSeoUrl: productType.data?.seoUrl,
    productTypeGroupSeoUrl: productTypeGroup.data?.seoUrl,
    productionBrandKeys: context.query.brands
      ? (context.query.brands as string).split(',')
      : undefined,
    sortBy: (context.query['sap-xep-theo'] as 'GIA_BAN_LE') || undefined,
    sortOrder: (context.query['sort'] as 'ASC' | 'DESC') || undefined,
    isPrescripted:
      filterIsPrescripted === 'ALL'
        ? undefined
        : filterIsPrescripted === 'true',
  });

  if (products.data) {
    productTypeGroupData.products = products.data;
  }

  return productTypeGroupData;
};

export default getProductTypeGroupData;
