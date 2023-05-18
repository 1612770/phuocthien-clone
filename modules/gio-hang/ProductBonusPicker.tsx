import {
  CheckOutlined,
  InfoCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import ImageWithFallback from '@components/templates/ImageWithFallback';
import OfferModel from '@configs/models/offer.model';
import TimeUtils from '@libs/utils/time.utils';
import { useCheckout } from '@providers/CheckoutProvider';
import { Button, Empty, List, Typography, theme } from 'antd';
import React from 'react';

function ProductBonusPicker({
  offers,
  onUseOffer,
}: {
  offers?: OfferModel[];
  onUseOffer: (offerCode: string) => void;
}) {
  const { token } = theme.useToken();
  const { offer, totalPriceBeforeDiscountOnProduct } = useCheckout();

  return (
    <div className="">
      <Typography.Paragraph className="m-4 mb-2 font-semibold uppercase">
        Ưu đãi khi mua hàng
      </Typography.Paragraph>

      <List>
        {offers?.map((of) => {
          const isActived = offer?.key === of.key;
          const enable =
            (of.minAmountOffer || 0) <= totalPriceBeforeDiscountOnProduct;

          return (
            <List.Item
              className={`transition-all duration-200 ease-in-out hover:bg-gray-100 ${
                isActived
                  ? 'bg-primary-background hover:bg-primary-background'
                  : ''
              }`}
              key={of.key}
              actions={[
                isActived ? (
                  <Button
                    shape="circle"
                    className="p-0"
                    icon={
                      <CheckOutlined
                        style={{
                          color: token.colorPrimary,
                        }}
                        key={'check'}
                      />
                    }
                  ></Button>
                ) : (
                  <Button
                    shape="circle"
                    onClick={() => onUseOffer(of.offerCode || '')}
                    disabled={!enable}
                  >
                    <PlusOutlined
                      style={{
                        color: token.colorTextLabel,
                      }}
                      key={'check'}
                    />
                  </Button>
                ),
              ]}
            >
              <List.Item.Meta
                avatar={
                  <div className="h-[32px] w-[32px]">
                    <ImageWithFallback
                      src={of.offerImg || ''}
                      alt="Khuyen mai"
                      getMockImage={() => '/promotion.png'}
                      width={32}
                      height={32}
                      layout="fixed"
                    />
                  </div>
                }
                title={
                  <div className="">
                    {of.offerCode && (
                      <Typography.Paragraph
                        className={`m-0 font-medium ${
                          isActived ? 'text-primary' : 'text-gray-600'
                        }`}
                      >
                        Mã ưu đãi: {of.offerCode}{' '}
                      </Typography.Paragraph>
                    )}
                    {of.offerName && (
                      <Typography.Paragraph
                        className={`m-0 font-medium ${
                          isActived ? 'text-primary' : 'text-gray-600'
                        }`}
                      >
                        {of.offerName}{' '}
                      </Typography.Paragraph>
                    )}
                  </div>
                }
                description={
                  <>
                    {!enable && (
                      <Typography.Paragraph className="m-0 text-xs text-blue-500">
                        <InfoCircleOutlined
                          style={{
                            fontSize: 12,
                          }}
                        />{' '}
                        Chưa đủ điều kiện áp dụng
                      </Typography.Paragraph>
                    )}
                    {(of.beginDate || of.endDate) && (
                      <Typography.Paragraph className="m-0 text-xs text-gray-600">
                        Ưu đãi chỉ diễn ra{' '}
                        {of.beginDate
                          ? `từ ${TimeUtils.formatDate(of.beginDate, {
                              noTime: true,
                            })} `
                          : ''}
                        {of.endDate
                          ? `đến ${TimeUtils.formatDate(of.endDate, {
                              noTime: true,
                            })}`
                          : ''}
                      </Typography.Paragraph>
                    )}
                  </>
                }
              />

              <div className="my-1 flex"></div>
            </List.Item>
          );
        })}
      </List>

      {!offers?.length && (
        <Empty
          description={
            <Typography>Đón chờ những ưu đãi hấp dẫn từ nhà thuốc</Typography>
          }
        ></Empty>
      )}
    </div>
  );
}

export default ProductBonusPicker;
