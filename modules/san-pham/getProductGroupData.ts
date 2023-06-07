import PRODUCTS_LOAD_PER_TIME from '@configs/constants/products-load-per-time';
import BrandModel from '@configs/models/brand.model';
import ProductGroupModel from '@configs/models/product-group.model';
import ProductType from '@configs/models/product-type.model';
import Product from '@configs/models/product.model';
import WithPagination from '@configs/types/utils/with-pagination';
import { GeneralClient } from '@libs/client/General';
import { ProductClient } from '@libs/client/Product';
import { GetServerSidePropsContext } from 'next';

const getProductGroupData = async (context: GetServerSidePropsContext) => {
  const productGroupData: {
    productType?: ProductType;
    productGroup?: ProductGroupModel;
    productBrands?: BrandModel[];
    products?: WithPagination<Product[]>;
  } = {};

  const generalClient = new GeneralClient(null, {});
  const productClient = new ProductClient(null, {});
  const productGroupProductSeoUrl = context.params
    ?.productGroupProduct as string;
  const productTypeSeoUrl = context.params?.productType as string;

  const [productType, productGroup, productBrands] = await Promise.all([
    generalClient.getProductTypeDetail({
      seoUrl: productTypeSeoUrl,
    }),
    generalClient.getProductGroupDetail({
      seoUrl: productGroupProductSeoUrl,
    }),
    generalClient.getProductionBrands(),
  ]);

  if (!productGroup.data) throw new Error('Không tìm thấy nhóm sản phẩm');

  productGroupData.productType = productType.data;
  productGroupData.productGroup = productGroup.data;
  productGroupData.productBrands = productBrands.data;

  const products = await productClient.getProducts({
    page: context.query.trang ? Number(context.query.trang) : 1,
    pageSize: PRODUCTS_LOAD_PER_TIME,
    isPrescripted: false,
    productTypeKey: productType.data?.key,
    productGroupKey: productGroup.data?.key,
    productionBrandKeys: context.query.brands
      ? (context.query.brands as string).split(',')
      : undefined,
    sortBy: (context.query['sap-xep-theo'] as 'GIA_BAN_LE') || undefined,
    sortOrder: (context.query['sap-xep'] as 'ASC' | 'DESC') || undefined,
  });

  if (products.data) {
    productGroupData.products = products.data;
  }

  return productGroupData;
};

export default getProductGroupData;
