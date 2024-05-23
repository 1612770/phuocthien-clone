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
  const lv2ParamSeoUrl = context.params?.lv2Param as string;
  const lv1ParamSeoUrl = context.params?.lv1Param as string;

  const [productType, productGroup, productBrands] = await Promise.all([
    generalClient.getProductTypeDetail({
      seoUrl: lv1ParamSeoUrl,
    }),
    generalClient.getProductGroupDetail({
      seoUrl: lv2ParamSeoUrl,
    }),
    generalClient.getProductionBrands(),
  ]);

  if (!productGroup.data) throw new Error('Không tìm thấy nhóm sản phẩm');
  if (productType.data?.key !== productGroup.data?.productTypeKey) {
    throw new Error('Không tìm thấy nhóm sản phẩm trong loại sản phẩm');
  }
  productGroupData.productType = productType.data;
  productGroupData.productGroup = productGroup.data;
  productGroupData.productBrands = productBrands.data;

  const products = await productClient.getProducts({
    page: context.query.trang ? Number(context.query.trang) : 1,
    pageSize: PRODUCTS_LOAD_PER_TIME,
    productTypeKey: productType.data?.key,
    productGroupKey: productGroup.data?.key,
    productionBrandKeys: context.query.brands
      ? (context.query.brands as string).split(',')
      : undefined,
    sortBy: (context.query['sap-xep-theo'] as 'GIA_BAN_LE') || undefined,
    sortOrder: (context.query['sort'] as 'ASC' | 'DESC') || undefined,
  });

  if (products.data) {
    productGroupData.products = products.data;
  }

  return productGroupData;
};

export default getProductGroupData;
