import { Button, Form, Input, Typography } from 'antd';
import { ArrowRight, Gift } from 'react-feather';
import { useEffect, useState } from 'react';
import { useCheckout } from '@providers/CheckoutProvider';
import OfferModel from '@configs/models/offer.model';
import ProductBonusSection from '@modules/products/ProductBonusSection';
import { useAppMessage } from '@providers/AppMessageProvider';
import { useAppConfirmDialog } from '@providers/AppConfirmDialogProvider';

function PromotionCodeInput({ offers }: { offers: OfferModel[] }) {
  const [openInput, setOpenInput] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const { offers: checkoutOffers, setOffers, totalRawPrice } = useCheckout();
  const { toastError, toastSuccess } = useAppMessage();
  const { setConfirmData } = useAppConfirmDialog();

  useEffect(() => {
    setInputValue('');
  }, [openInput]);

  const onUseOffer = () => {
    setInputValue('');
    const trimmedInput = inputValue.trim();

    if (!trimmedInput) return;

    const foundOffer = offers.find((offer) => {
      return offer.offerCode === trimmedInput;
    });

    const offerAlreadyUsed = !!checkoutOffers.find(
      (offer) => offer.offerCode === trimmedInput
    );

    if (offerAlreadyUsed) {
      return toastError({ data: 'Mã giảm giá đã được sử dụng' });
    }

    if (foundOffer) {
      const newOffers = [...checkoutOffers, foundOffer];
      setOffers(newOffers);

      toastSuccess({ data: 'Áp dụng mã giảm giá thành công' });
    } else {
      toastError({ data: 'Mã giảm giá không hợp lệ' });
    }
  };
  return (
    <div>
      <Button
        size={'large'}
        className="h-[40px]"
        onClick={() => {
          setOpenInput(!openInput);
        }}
      >
        <div className="flex items-center text-primary">
          <Gift size={16} />
          <Typography className="mx-2 text-base text-inherit">
            Sử dụng mã giảm giá / phiếu quà tặng
          </Typography>
          <ArrowRight size={16} />
        </div>
      </Button>

      {openInput && (
        <>
          <ProductBonusSection offers={offers} />
          <div>
            <Input.Group compact className="flex">
              <Input
                size="large"
                placeholder="Nhập mã giảm giá"
                value={inputValue}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    onUseOffer();
                    return false;
                  }
                }}
                onChange={(e) => {
                  setInputValue(e.target.value);
                }}
              />
              <Form.Item noStyle>
                <Button
                  size="large"
                  className="rounded-tl-none rounded-bl-none shadow-none"
                  type="primary"
                  onClick={onUseOffer}
                >
                  Áp dụng
                </Button>
              </Form.Item>
            </Input.Group>
          </div>

          {checkoutOffers.length > 0 && (
            <div className="mt-4">
              <Typography.Text type="secondary">
                Mã giảm giá đã áp dụng:
              </Typography.Text>
              {checkoutOffers.map((offer) => (
                <div key={offer.key}>
                  <div className="flex items-center justify-between">
                    <Typography.Text className="text-base">
                      {checkoutOffers[0].offerCode}
                    </Typography.Text>
                    <Button
                      className="ml-2"
                      size="small"
                      onClick={() => {
                        setConfirmData({
                          title: 'Xóa mã giảm giá',
                          content: 'Bạn có chắc muốn xóa mã giảm giá này?',
                          onOk: () => {
                            const newOffers = checkoutOffers.filter(
                              (filterOffer) =>
                                filterOffer.offerCode !== offer.offerCode
                            );
                            setOffers(newOffers);
                          },
                        });
                      }}
                    >
                      Xóa
                    </Button>
                  </div>
                  {totalRawPrice >= (offer.minAmountOffer || 0) && (
                    <Typography.Text type="secondary" className="text-primary">
                      -
                      {offer.offerVal?.toLocaleString('it-IT', {
                        style: 'currency',
                        currency: 'VND',
                      })}
                    </Typography.Text>
                  )}
                  {totalRawPrice < (offer.minAmountOffer || 0) && (
                    <Typography.Text
                      type="secondary"
                      className=" text-blue-500"
                    >
                      Chưa đủ điều kiện áp dụng, cần mua thêm{' '}
                      {(
                        (offer.minAmountOffer || 0) - totalRawPrice
                      ).toLocaleString('it-IT', {
                        style: 'currency',
                        currency: 'VND',
                      })}
                    </Typography.Text>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default PromotionCodeInput;
