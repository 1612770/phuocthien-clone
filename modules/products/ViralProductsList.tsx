import ProductCard from 'components/templates/ProductCard';
import { Button, Typography } from 'antd';
import { ProductClient } from '@libs/client/Product';
import { useState } from 'react';
import ViralProductsListModel from '@configs/models/viral-products-list.model';
import { useAppMessage } from '@providers/AppMessageProvider';
import Product from '@configs/models/product.model';
import VIRAL_PRODUCTS_LOAD_PER_TIME from '@configs/constants/viral-products-load-per-time';
import ImageWithFallback from '@components/templates/ImageWithFallback';
import { useRouter } from 'next/router';
import { DoubleRightOutlined } from '@ant-design/icons';

function ViralProductsList({
  viralProductsList,
  invertBackground,
}: {
  viralProductsList?: ViralProductsListModel;
  invertBackground?: boolean;
}) {
  const [listViralProducts, setListViralProducts] = useState<
    {
      key?: string;
      groupViralKey?: string;
      productKey?: string;
      productInfo?: Product;
    }[]
  >(viralProductsList?.listProductViral || []);
  const [loadingMore, setLoadingMore] = useState(false);
  const [allowLoadMore, setAllowLoadMore] = useState(
    viralProductsList?.listProductViral?.length === VIRAL_PRODUCTS_LOAD_PER_TIME
  );
  const router = useRouter();
  const { toastError } = useAppMessage();

  const loadMore = async () => {
    if (loadingMore) return;

    try {
      const productClient = new ProductClient(null, {});

      setLoadingMore(true);
      const viralProducts = await productClient.getViralProducts({
        page:
          Math.floor(listViralProducts.length / VIRAL_PRODUCTS_LOAD_PER_TIME) +
          1,
        pageSize: VIRAL_PRODUCTS_LOAD_PER_TIME,
        key: viralProductsList?.seoUrl,
      });

      const newMoreListViralProducts =
        viralProducts.data?.[0].listProductViral || [];

      setListViralProducts([...listViralProducts, ...newMoreListViralProducts]);
      setAllowLoadMore(
        newMoreListViralProducts.length === VIRAL_PRODUCTS_LOAD_PER_TIME
      );
    } catch (error) {
      toastError({ data: error });
    } finally {
      setLoadingMore(false);
    }
  };

  if (
    typeof viralProductsList?.visible === 'boolean' &&
    !viralProductsList?.visible
  ) {
    return null;
  }

  return listViralProducts?.length ? (
    <div
      className={
        'py-2 md:py-4 ' + (invertBackground ? 'bg-primary-light' : 'bg-white')
      }
    >
      <div
        className={`rounded-t-xl bg-gradient-to-t  from-primary-bestsell-color-dark  to-primary-bestsell-color-light px-0 lg:container`}
      >
        <div className=" flex items-center justify-center text-center  lg:justify-center">
          <Typography.Title
            level={3}
            className={
              'm-0 my-4 text-center  font-medium text-white ' +
              (invertBackground ? 'text-white' : '')
            }
          >
            {viralProductsList?.name}
          </Typography.Title>
        </div>
        {viralProductsList?.imageUrl && (
          <div
            onClick={() =>
              router.push(`/san-pham-noi-bat/${viralProductsList?.seoUrl}`)
            }
            className="cursor-pointer"
          >
            <div className="relative mb-4 aspect-[21/9] h-[200px] w-full">
              <ImageWithFallback
                src={viralProductsList?.imageUrl || ''}
                layout="fill"
                objectFit="cover"
              ></ImageWithFallback>
            </div>
          </div>
        )}
      </div>

      <div className=" rounded-b-xl bg-gradient-to-b  from-primary-bestsell-color-dark  to-primary-bestsell-color-light p-2 lg:container">
        <div className="hidden grid-cols-5 lg:grid lg:gap-2">
          {listViralProducts.map((product, index) =>
            product.productInfo ? (
              <div className="w-full" key={index}>
                <ProductCard product={product.productInfo} />
              </div>
            ) : null
          )}
        </div>
        <div className="grid w-full grid-cols-2 overflow-auto lg:hidden">
          {listViralProducts.map((product, index) =>
            product.productInfo ? (
              <ProductCard
                key={index}
                product={product.productInfo}
                className=""
              />
            ) : null
          )}
        </div>

        <div className="mt-2 flex justify-center">
          {allowLoadMore && (
            <Button
              type="text"
              icon={
                <DoubleRightOutlined className="mr-1 rotate-90" size={12} />
              }
              className={' text-primary-dark lg:inline-block '}
              ghost
              onClick={loadMore}
              loading={loadingMore}
            >
              Xem thêm
            </Button>
          )}

          {/* <Button
            className={
              'inline-block lg:hidden ' +
              (invertBackground ? 'border-white text-white' : '')
            }
            ghost
            onClick={() =>
              router.push(`/san-pham-noi-bat/${viralProductsList?.seoUrl}`)
            }
          >
            Xem tất cả
          </Button> */}
        </div>
      </div>
    </div>
  ) : null;
}

export default ViralProductsList;
