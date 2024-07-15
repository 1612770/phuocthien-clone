import PRODUCTS_LOAD_PER_TIME from '@configs/constants/products-load-per-time';
import BrandModel from '@configs/models/brand.model';
import ProductGroupModel from '@configs/models/product-group.model';
import ProductType from '@configs/models/product-type.model';
import Product from '@configs/models/product.model';
import WithPagination from '@configs/types/utils/with-pagination';
import { GeneralClient } from '@libs/client/General';
import { ProductClient } from '@libs/client/Product';

const getProductGroupData = async ({
  productTypeSeoUrl,
  productGroupSeoUrl,
}: {
  productTypeSeoUrl: string;
  productGroupSeoUrl: string;
}) => {
  const productGroupData: {
    productType?: ProductType;
    productGroup?: ProductGroupModel;
    productBrands?: BrandModel[];
    products?: WithPagination<Product[]>;
  } = {};

  const generalClient = new GeneralClient(null, {});
  const productClient = new ProductClient(null, {});

  const [productType, productGroup, productBrands] = await Promise.all([
    generalClient.getProductTypeDetail({
      seoUrl: productTypeSeoUrl,
    }),
    generalClient.getProductGroupDetail({
      seoUrl: productGroupSeoUrl,
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
    page: 1,
    pageSize: PRODUCTS_LOAD_PER_TIME,
    productTypeKey: productType.data?.key,
    productGroupKey: productGroup.data?.key,
    productionBrandKeys: undefined,
    sortBy: undefined,
    sortOrder: undefined,
    isPrescripted: undefined,
  });

  if (products.data) {
    productGroupData.products = products.data;
  }

  return productGroupData;
};

export default getProductGroupData;
