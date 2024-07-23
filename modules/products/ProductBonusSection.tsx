import ImageWithFallback from '@components/templates/ImageWithFallback';
import OfferModel from '@configs/models/offer.model';
import TimeUtils from '@libs/utils/time.utils';
import { List, Typography } from 'antd';
import React from 'react';

function ProductBonusSection({ offers }: { offers?: OfferModel[] }) {
  if (!offers?.length) return null;
  return (
    <div className="my-4 rounded-lg border border-solid border-blue-500 bg-blue-50 py-2 px-4 ">
      <Typography className="font-medium">Ưu đãi khi mua hàng</Typography>

      <List>
        {offers?.map((offer) => (
          <List.Item className="py-2 px-0" key={offer.key}>
            <div className="my-1 flex">
              <div className="h-[32px] w-[32px]">
                <ImageWithFallback
                  src={offer.offerImg || ''}
                  alt="Khuyen mai"
                  width={32}
                  height={32}
                  layout="fixed"
                />
              </div>
              <div className="ml-2">
                {offer.offerCode && (
                  <Typography.Paragraph className="m-0 font-medium">
                    Mã ưu đãi: {offer.offerCode}{' '}
                  </Typography.Paragraph>
                )}
                {offer.offerName && (
                  <Typography.Paragraph className="m-0 text-sm">
                    {offer.offerName}{' '}
                  </Typography.Paragraph>
                )}
                {(offer.beginDate || offer.endDate) && (
                  <Typography.Paragraph className="m-0 text-sm text-gray-600">
                    Ưu đãi chỉ diễn ra{' '}
                    {offer.beginDate
                      ? `từ ${TimeUtils.formatDate(offer.beginDate, {
                          noTime: true,
                        })} `
                      : ''}
                    {offer.endDate
                      ? `đến ${TimeUtils.formatDate(offer.endDate, {
                          noTime: true,
                        })}`
                      : ''}
                  </Typography.Paragraph>
                )}
              </div>
            </div>
          </List.Item>
        ))}
      </List>
    </div>
  );
}

export default ProductBonusSection;
