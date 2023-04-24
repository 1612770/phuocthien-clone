import PrimaryLayout from 'components/layouts/PrimaryLayout';
import { NextPageWithLayout } from '../page';
import ImageWithFallback from '@components/templates/ImageWithFallback';
import { Typography } from 'antd';
import ProductCard from '@components/templates/ProductCard';
import Product from '@configs/models/product.model';

const product = {
  key: 'string;',
  code: 'string;',
  name: 'string;',
  productionCode: 'string;',
  unit: 'string;',
  vat: 10,
  sellingPriceRatio: 10,
  // Giá mua vào
  purchasePrice: 10,
  // Giá bán lẻ
  retailPrice: 10,
  // Giá bán buôn
  wholePrice: 10,
  reducingRatio: 10,
  // Giá vốn
  costPrice: 10,
  drugContent: 'string;',
  ingredient: 'string;',
  note: 'string;',
  registrationNumber: 'string;',
  packagingProcess: 'string;',
  isPrescripted: true,
  isSpecial: true,
  isConsigned: true,
  isMental: true,
  isDestroyed: true,
  visible: true,
  productTypeKey: 'string;',
  productGroupKey: 'string;',
  productionBrandKey: 'string;',
  // productType: ProductType;
  // productGroup: ProductGroupModel;
  // productionBrand: ProductBrand;
  detail: { displayName: 'Sản phẩm thức uống từ lúa mạch nguyên chất' },
  // images: ProductImage[];
  // promotions: Promotion[];
};

const promotions = [
  {
    name: 'Chương trình khuyến mãi 1',
    banner: 'https://phuocthien.net/photos/173320CH_lapoche.png',
    id: '1',
    products: [product, product, product, product, product],
  },
  {
    name: 'Chương trình khuyến mãi 2',
    banner: 'https://phuocthien.net/photos/173320CH_lapoche.png',
    id: '2',
    products: [product, product, product, product, product],
  },
  {
    name: 'Chương trình khuyến mãi 3',
    banner: 'https://phuocthien.net/photos/173320CH_lapoche.png',
    id: '3',
    products: [product, product, product, product, product],
  },
];

const getPromotionId = (id: string) => {
  return `promotion-section-${id}`;
};

const Home: NextPageWithLayout = () => {
  const scrollIntoView = (id: string) => {
    const element = document.getElementById(getPromotionId(id));
    const headerHeight = 48;
    const offsetTop = element?.offsetTop || 0;

    if (element) {
      window.scrollTo({
        top: offsetTop - headerHeight,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="mb-0 lg:mb-8">
      <div className="relative h-[200px] w-full lg:h-[400px]">
        <ImageWithFallback
          src={'https://phuocthien.net/photos/173320CH_lapoche.png'}
          priority
          alt="chuong trinh khuyen mai"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
        />
      </div>
      <div className="sticky top-0 z-10 bg-primary ">
        <div className="container flex gap-2 overflow-auto px-2 py-2 sm:justify-start md:px-0 lg:justify-center">
          {promotions.map((promotion) => (
            <div
              className="cursor-pointer rounded-full border border-solid border-white px-4 py-1 text-white transition-all duration-200 ease-in-out hover:bg-white hover:text-primary"
              key={promotion.id}
              onClick={() => scrollIntoView(promotion.id)}
            >
              <Typography.Text className="whitespace-nowrap text-inherit transition-all duration-200 ease-in-out">
                {promotion.name}
              </Typography.Text>
            </div>
          ))}
        </div>
      </div>

      <div className="container">
        {promotions.map((promotion) => (
          <div
            key={promotion.id}
            id={getPromotionId(promotion.id)}
            className="pt-4"
          >
            <div className="relative h-[50px] w-full">
              <ImageWithFallback
                src={'https://phuocthien.net/photos/173320CH_lapoche.png'}
                priority
                alt="chuong trinh khuyen mai"
                layout="fill"
                objectFit="cover"
                objectPosition="center"
              />
            </div>

            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
              {promotion.products.map((product: Product) => (
                <ProductCard product={product} key={product.key} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

Home.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};

// export const getServerSideProps = async (
//   context: GetServerSidePropsContext
// ) => {
//   const serverSideProps: {
//     props: {
//     };
//   } = {
//     props: {
//     },
//   };

//   return serverSideProps;
// };
