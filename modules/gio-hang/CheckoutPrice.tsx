import { DownOutlined, UpOutlined } from '@ant-design/icons';
import OfferModel from '@configs/models/offer.model';
import CurrencyUtils from '@libs/utils/currency.utils';
import OfferCodeInput from '@modules/cart/OfferCodeInput';
import { useCart } from '@providers/CartProvider';
import { useCheckout } from '@providers/CheckoutProvider';
import { Typography, Button, Divider, Grid } from 'antd';
import React, { useState } from 'react';

interface CheckoutPriceProps {
  offers: OfferModel[];
  onCheckout: () => void;
}

function CheckoutPrice({ offers, onCheckout }: CheckoutPriceProps) {
  const { choosenCartProducts } = useCart();
  const [isShowInfoMobile, setIsShowInfoMobile] = useState(false);

  const {
    checkoutError,
    checkingOut,
    totalPriceAfterDiscountOnProduct,
    totalPriceBeforeDiscountOnProduct,
    offerCodePrice,
    cartStep,
    setCartStep,
  } = useCheckout();

  const totalProducts = choosenCartProducts.reduce(
    (total, cartProduct) => total + (Number(cartProduct.quantity) || 0),
    0
  );

  const { lg } = Grid.useBreakpoint();

  return (
    <div
      className={
        lg
          ? ''
          : ' fixed bottom-0 left-0 right-0 z-10 overflow-hidden rounded-tl-xl rounded-tr-xl'
      }
      style={{
        boxShadow: lg ? '' : '0 -2px 8px rgb(0 0 0 / 10%)',
      }}
    >
      <div className="border-none bg-white px-4 py-4 shadow-none md:rounded-lg md:border-solid md:border-gray-100 md:py-4">
        {(lg || isShowInfoMobile) && (
          <>
            <Typography.Title level={5} className="font-medium uppercase">
              {totalProducts} sản phẩm
            </Typography.Title>

            <div className="my-1 flex justify-between">
              <Typography.Text className="text-gray-500">
                Tạm tính
              </Typography.Text>
              <Typography.Text className="font-bold text-primary-light">
                {CurrencyUtils.format(totalPriceBeforeDiscountOnProduct)}
              </Typography.Text>
            </div>
            <div className="my-1 flex justify-between">
              <Typography.Text className="text-gray-500">
                Giảm giá trực tiếp
              </Typography.Text>
              <Typography.Text className="font-semibold text-gray-700">
                {CurrencyUtils.format(
                  totalPriceBeforeDiscountOnProduct -
                    totalPriceAfterDiscountOnProduct
                )}
              </Typography.Text>
            </div>
            <div className="my-1 flex justify-between">
              <Typography.Text className="text-gray-500">
                Ưu đãi áp dụng
              </Typography.Text>
              <Typography.Text className="font-semibold text-gray-700">
                {CurrencyUtils.format(offerCodePrice)}
              </Typography.Text>
            </div>

            <div className="my-1 flex justify-between">
              <Typography.Text className="text-gray-500">
                Tiết kiệm
              </Typography.Text>
              <Typography.Text className="font-semibold text-gray-700">
                {CurrencyUtils.format(
                  totalPriceBeforeDiscountOnProduct -
                    totalPriceAfterDiscountOnProduct +
                    offerCodePrice
                )}
              </Typography.Text>
            </div>

            <Divider className="my-2 lg:my-4"></Divider>
            <OfferCodeInput offers={offers} />
            <Divider className="my-2 lg:my-4"></Divider>
          </>
        )}
        <div className="hidden lg:block">
          <div className="mt-4 flex items-center justify-between gap-4">
            <Typography.Title className="m-0" level={4}>
              Tổng tiền
            </Typography.Title>
            <Typography.Title level={4} className="m-0 text-primary">
              {CurrencyUtils.format(
                totalPriceAfterDiscountOnProduct - offerCodePrice
              )}
            </Typography.Title>
          </div>

          {checkoutError && (
            <Typography className="mt-2 text-center text-base text-red-500">
              {checkoutError}
            </Typography>
          )}

          <Button hidden htmlType="submit" />
          {cartStep === 'checkout' && (
            <Button
              type="primary"
              onClick={() => {
                onCheckout();
              }}
              loading={checkingOut}
              size="large"
              block
              className="mt-4 mb-2 h-[48px] bg-primary-light text-base font-medium uppercase shadow-none"
            >
              Hoàn tất ({totalProducts})
            </Button>
          )}

          {cartStep === 'cart' && (
            <Button
              type="primary"
              onClick={() => {
                setCartStep('checkout');
              }}
              loading={checkingOut}
              size="large"
              block
              disabled={!totalProducts}
              className={`${
                totalProducts ? 'bg-primary-light' : 'bg-gray-200'
              } mt-4 mb-2 h-[48px] text-base font-medium uppercase shadow-none`}
            >
              Đặt hàng ({totalProducts})
            </Button>
          )}
        </div>

        <div className="block lg:hidden">
          {checkoutError && (
            <Typography className="text-center text-sm text-red-500">
              {checkoutError}
            </Typography>
          )}

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <Typography.Title
                className="m-0"
                onClick={() => setIsShowInfoMobile(!isShowInfoMobile)}
                level={5}
              >
                Tổng tiền {isShowInfoMobile ? <DownOutlined /> : <UpOutlined />}
              </Typography.Title>
              <Typography.Title level={5} className="m-0 text-primary">
                {CurrencyUtils.format(
                  totalPriceAfterDiscountOnProduct - offerCodePrice
                )}
              </Typography.Title>
            </div>
            <div>
              <Button hidden htmlType="submit" />
              {cartStep === 'checkout' && (
                <Button
                  type="primary"
                  onClick={() => {
                    onCheckout();
                  }}
                  loading={checkingOut}
                  block
                  className="h-[40px] bg-primary-light font-medium uppercase shadow-none"
                >
                  Hoàn tất ({totalProducts})
                </Button>
              )}

              {cartStep === 'cart' && (
                <Button
                  type="primary"
                  onClick={() => {
                    setCartStep('checkout');
                  }}
                  loading={checkingOut}
                  block
                  className={`${
                    totalProducts ? 'bg-primary-light' : 'bg-gray-200'
                  } h-[40px] font-medium uppercase shadow-none`}
                  disabled={!totalProducts}
                >
                  Đặt hàng ({totalProducts})
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPrice;
