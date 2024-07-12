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
import { DoubleRightOutlined } from '@ant-design/icons';

function PromotionProductsList({
  promotion,
  id,
  defaultProducts,
  isPrimaryBackground,
  scrollable,
  campaginSlug,
}: {
  campaginSlug?: string;
  promotion?: CampaignPromotion;
  defaultProducts: Product[];
  id?: string;
  isPrimaryBackground?: boolean;
  scrollable?: boolean;
}) {
  const [promotionProducts, setPromotionProducts] = useState<Product[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [allowLoadMore, setAllowLoadMore] = useState(
    promotionProducts.length === 20
  );

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
        page: Math.floor(promotionProducts.length / 20) + 1,
        pageSize: 20,
        keyPromo: promotion?.key,
        isHide: false,
      });

      if (data?.length) {
        setPromotionProducts((prev) => [...prev, ...data]);
      }
      if ((data?.length || 0) < 8) {
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
        className={`container   rounded-lg ${
          isPrimaryBackground ? 'bg-primary-light' : ''
        }`}
      >
        {promotion.imgUrl && (
          <div className="relative  mb-2 block aspect-[6/1] ">
            <ImageWithFallback
              src={promotion.imgUrl}
              priority
              alt="chuong trinh khuyen mai"
              layout="fill"
              objectFit="cover"
              sizes=" (min-width: 640px) 1200px, 640px"
            />
          </div>
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
              type="text"
              className={isPrimaryBackground ? 'border-white text-white' : ''}
              ghost
              onClick={loadMore}
              loading={loadingMore}
              icon={<DoubleRightOutlined className="rotate-90" />}
            >
              Xem thêm
            </Button>
          )}
          {scrollable && (
            <LinkWrapper
              href={`/khuyen-mai/${
                promotion.slug || promotion.campaignKey
              }?anchor=${promotion.key}`}
            >
              <Button
                type="primary"
                className={isPrimaryBackground ? ' text-white' : ''}
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
