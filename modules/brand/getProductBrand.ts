import PRODUCTS_LOAD_PER_TIME from '@configs/constants/products-load-per-time';
import BrandModel from '@configs/models/brand.model';
import ProductGroupModel from '@configs/models/product-group.model';
import ProductType from '@configs/models/product-type.model';
import Product from '@configs/models/product.model';
import WithPagination from '@configs/types/utils/with-pagination';
import { GeneralClient } from '@libs/client/General';
import { ProductClient } from '@libs/client/Product';
import { GetServerSidePropsContext } from 'next';

const getProductBrand = async (context: GetServerSidePropsContext) => {
  const productGroupData: {
    productBrand: BrandModel;
    products?: WithPagination<Product[]>;
  } = { productBrand: {}, products: undefined };

  const generalClient = new GeneralClient(null, {});
  const productClient = new ProductClient(null, {});
  const brandSeoUrl = context.params?.['brand'] as string;

  const [productBrands] = await Promise.all([
    generalClient.getProductionBrands(),
  ]);

  if (productBrands.data) {
    const _productBrand = productBrands.data.find(
      (el) => el.seoUrl === brandSeoUrl
    );
    if (!_productBrand) throw new Error('Không tìm thấy thương hiệu');

    productGroupData.productBrand = _productBrand as BrandModel;

    const products = await productClient.getProducts({
      page: context.query.trang ? Number(context.query.trang) : 1,
      pageSize: PRODUCTS_LOAD_PER_TIME,
      isPrescripted: false,
      productionBrandKeys: [`${brandSeoUrl}`],
      sortBy: (context.query['sap-xep-theo'] as 'GIA_BAN_LE') || undefined,
      sortOrder: (context.query['sort'] as 'ASC' | 'DESC') || undefined,
    });

    if (products.data) {
      productGroupData.products = products.data || [];
    }
  }

  return productGroupData;
};

export default getProductBrand;
