import PRODUCTS_LOAD_PER_TIME from '@configs/constants/products-load-per-time';
import BrandModel from '@configs/models/brand.model';
import Product from '@configs/models/product.model';
import WithPagination from '@configs/types/utils/with-pagination';
import { GeneralClient } from '@libs/client/General';
import { ProductClient } from '@libs/client/Product';

const getProductBrand = async ({ brandSeoUrl }: { brandSeoUrl: string }) => {
  const productGroupData: {
    productBrand: BrandModel;
    products?: WithPagination<Product[]>;
  } = { productBrand: {}, products: undefined };

  const generalClient = new GeneralClient(null, {});
  const productClient = new ProductClient(null, {});

  const productBrands = await generalClient.getProductionBrands();

  if (productBrands.data) {
    const _productBrand = productBrands.data.find(
      (el) => el.seoUrl === brandSeoUrl
    );

    if (!_productBrand) throw new Error('Không tìm thấy thương hiệu');

    productGroupData.productBrand = _productBrand as BrandModel;

    const products = await productClient.getProducts({
      page: 1,
      pageSize: PRODUCTS_LOAD_PER_TIME,
      productionBrandKeys: [`${brandSeoUrl}`],
      sortBy: undefined,
      sortOrder: undefined,
    });

    if (products.data) {
      productGroupData.products = products.data || [];
    }
  }

  return productGroupData;
};

export default getProductBrand;
