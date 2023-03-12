import { Button, Form, Input, Typography } from 'antd';
import { ArrowRight, Gift } from 'react-feather';
import { useEffect, useState } from 'react';
import { useCheckout } from '@providers/CheckoutProvider';
import OfferModel from '@configs/models/offer.model';
import ProductBonusSection from '@modules/products/ProductBonusSection';
import { useAppMessage } from '@providers/AppMessageProvider';
import { useAppConfirmDialog } from '@providers/AppConfirmDialogProvider';

function OfferCodeInput({ offers }: { offers: OfferModel[] }) {
  const [openInput, setOpenInput] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const { offer, setOffer, totalRawPrice } = useCheckout();
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

    const offerAlreadyUsed =
      offer && foundOffer && foundOffer?.offerCode === offer?.offerCode;
    if (offerAlreadyUsed) {
      return toastError({ data: 'Mã giảm giá đang được sử dụng' });
    }

    if (foundOffer) {
      if ((foundOffer.minAmountOffer || 0) > totalRawPrice) {
        return toastError({
          data: `Mã giảm giá này chỉ áp dụng cho đơn hàng trên ${foundOffer.minAmountOffer?.toLocaleString(
            'it-IT',
            {
              style: 'currency',
              currency: 'VND',
            }
          )}`,
        });
      }

      if (offer) {
        setConfirmData({
          title: 'Bạn đang áp dụng một mã giảm giá khác',
          content: 'Bạn có muốn thay đổi mã giảm giá?',
          onOk: () => {
            toastSuccess({ data: 'Thay đổi mã giảm giá thành công' });
            setOffer(foundOffer);
          },
        });
      } else {
        toastSuccess({ data: 'Áp dụng mã giảm giá thành công' });
        setOffer(foundOffer);
      }
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

          {offer && (
            <div className="mt-4">
              <Typography.Text type="secondary">
                Mã ưu đãi đã áp dụng:
              </Typography.Text>
              <div>
                <div className="flex items-center justify-between">
                  <Typography.Text className="text-base">
                    Mã ưu đãi: {offer.offerCode}
                  </Typography.Text>
                  <Button
                    className="ml-2"
                    size="small"
                    onClick={() => {
                      setConfirmData({
                        title: 'Xóa mã giảm giá',
                        content: 'Bạn có chắc muốn xóa mã giảm giá này?',
                        onOk: () => {
                          setOffer(undefined);
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
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default OfferCodeInput;
