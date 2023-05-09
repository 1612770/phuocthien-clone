import ProductCard from 'components/templates/ProductCard';
import { useEffect, useState } from 'react';
import { useAppMessage } from '@providers/AppMessageProvider';
import ImageWithFallback from '@components/templates/ImageWithFallback';
import {
  CampaignPromotion,
  PromotionPercent,
} from '@configs/models/promotion.model';
import Product from '@configs/models/product.model';
import LinkWrapper from '@components/templates/LinkWrapper';
import { PromotionClient } from '@libs/client/Promotion';
import { Button } from 'antd';

function PromotionProductsList({
  promotion,
  id,
  defaultProducts,
  isPrimaryBackground,
  scrollable,
}: {
  promotion?: CampaignPromotion;
  defaultProducts: Product[];
  id?: string;
  isPrimaryBackground?: boolean;
  scrollable?: boolean;
}) {
  const [promotionProducts, setPromotionProducts] = useState<Product[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [allowLoadMore, setAllowLoadMore] = useState(true);

  const { toastError } = useAppMessage();

  useEffect(() => {
    setPromotionProducts(defaultProducts || []);
  }, [defaultProducts]);

  const loadMore = async () => {
    if (loadingMore || !promotion) return;

    try {
      const promotionClient = new PromotionClient(null, {});

      setLoadingMore(true);

      const { data } = await promotionClient.getPromoProducts({
        page: Math.ceil(promotionProducts.length / 20) + 1,
        pageSize: 20,
        keyPromo: promotion?.key,
      });

      if (data?.length) {
        setPromotionProducts((prev) => [...prev, ...data]);
      }
      if ((data?.length || 0) < 20) {
        setAllowLoadMore(false);
      }
    } catch (error) {
      toastError({ data: error });
    } finally {
      setLoadingMore(false);
    }
  };

  if (!promotion) return null;

  return (
    <div key={promotion.key} id={id} className="">
      <div
        className={`container mt-4  rounded-lg ${
          isPrimaryBackground ? 'bg-primary-light' : ''
        }`}
      >
        {promotion.imgUrl && (
          <LinkWrapper
            className="relative mt-4 mb-2 block h-[100px] w-full lg:h-[200px]"
            href={`/chuong-trinh-khuyen-mai/${promotion.campaignKey}?anchor=${promotion.key}`}
          >
            <ImageWithFallback
              src={promotion.imgUrl}
              priority
              alt="chuong trinh khuyen mai"
              layout="fill"
              objectFit="cover"
              sizes="(min-width: 640px) 1200px, 640px"
            />
          </LinkWrapper>
        )}
        <div className="flex p-2">
          {!scrollable && (
            <div className="grid grid-cols-2 items-center justify-items-center gap-2 md:grid-cols-3 lg:grid-cols-4">
              {promotionProducts.map((product: Product) => {
                const promotionPercent = promotion.promoPercent.find(
                  (prmp) => prmp.key === product.keyPromoPercent
                );

                return (
                  <ProductCard
                    product={product}
                    key={product.key}
                    promotionPercent={promotionPercent as PromotionPercent}
                    showMinQuantity
                  />
                );
              })}
            </div>
          )}

          {scrollable && (
            <div className="flex flex-nowrap items-center justify-items-center gap-2 overflow-auto md:hidden md:grid-cols-2 lg:grid-cols-4">
              {promotionProducts.map((product: Product) => {
                const promotionPercent = promotion.promoPercent.find(
                  (prmp) => prmp.key === product.keyPromoPercent
                );

                return (
                  <ProductCard
                    product={product}
                    key={product.key}
                    promotionPercent={promotionPercent as PromotionPercent}
                    showMinQuantity
                    className="min-w-[240px] max-w-[240px]"
                  />
                );
              })}
            </div>
          )}
        </div>

        <div className="flex justify-center pt-2 pb-4">
          {!scrollable && allowLoadMore && (
            <Button
              type="primary"
              className={isPrimaryBackground ? 'border-white text-white' : ''}
              ghost
              onClick={loadMore}
              loading={loadingMore}
            >
              Xem thêm các sản phẩm khác
            </Button>
          )}
          {scrollable && (
            <LinkWrapper
              href={`/chuong-trinh-khuyen-mai/${promotion.campaignKey}?anchor=${promotion.key}`}
            >
              <Button
                type="primary"
                className={isPrimaryBackground ? 'border-white text-white' : ''}
                ghost
              >
                Xem chi tiết chương trình
              </Button>
            </LinkWrapper>
          )}
        </div>
      </div>
    </div>
  );
}

export default PromotionProductsList;
