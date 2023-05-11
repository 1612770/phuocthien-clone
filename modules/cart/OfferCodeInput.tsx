import { Badge, Button, Drawer, Form, Grid, Input } from 'antd';
import { useEffect, useState } from 'react';
import OfferModel from '@configs/models/offer.model';

import { ArrowRightOutlined, GiftOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import ProductBonusPicker from '@modules/gio-hang/ProductBonusPicker';
import { useCheckout } from '@providers/CheckoutProvider';
import { useAppConfirmDialog } from '@providers/AppConfirmDialogProvider';
import { useAppMessage } from '@providers/AppMessageProvider';

const NoPaddingContentDrawer = styled(Drawer)`
  .ant-drawer-body {
    padding: 0;
  }
`;

function OfferCodeInput({ offers }: { offers: OfferModel[] }) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const { offer: checkoutOffer } = useCheckout();
  const [inputValue, setInputValue] = useState('');

  const { offer, setOffer, totalPriceAfterDiscountOnProduct } = useCheckout();
  const { toastError, toastSuccess } = useAppMessage();
  const { setConfirmData } = useAppConfirmDialog();

  useEffect(() => {
    setInputValue('');
  }, [openDrawer]);

  const onUseOffer = (offerCode: string) => {
    setInputValue('');
    const trimmedInput = offerCode.trim();

    if (!trimmedInput) return;

    const foundOffer = offers.find((offer) => {
      return offer.offerCode === trimmedInput;
    });

    const offerAlreadyUsed =
      offer && foundOffer && foundOffer?.offerCode === offer?.offerCode;
    if (offerAlreadyUsed) {
      return toastError({ data: 'Mã ưu đãi đang được sử dụng' });
    }

    if (foundOffer) {
      if ((foundOffer.minAmountOffer || 0) > totalPriceAfterDiscountOnProduct) {
        return toastError({
          data: `Mã ưu đãi này chỉ áp dụng cho đơn hàng trên ${foundOffer.minAmountOffer?.toLocaleString(
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
          title: 'Bạn đang áp dụng một mã ưu đãi khác',
          content: 'Bạn có muốn thay đổi mã ưu đãi?',
          onOk: () => {
            toastSuccess({ data: 'Thay đổi mã ưu đãi thành công' });
            setOffer(foundOffer);
          },
        });
      } else {
        toastSuccess({ data: 'Áp dụng mã ưu đãi thành công' });
        setOffer(foundOffer);
      }
    } else {
      toastError({ data: 'Mã ưu đãi không hợp lệ' });
    }
  };

  const { md } = Grid.useBreakpoint();

  return (
    <div>
      <Badge count={checkoutOffer ? 1 : 0} className="w-full">
        <Button
          type="primary"
          ghost
          block
          onClick={() => {
            setOpenDrawer(!openDrawer);
          }}
        >
          <GiftOutlined />
          Sử dụng mã ưu đãi / phiếu quà tặng
          <ArrowRightOutlined />
        </Button>
      </Badge>

      <NoPaddingContentDrawer
        title={md ? 'Sử dụng mã ưu đãi / phiếu quà tặng' : 'Sử dụng mã ưu đãi'}
        placement="right"
        onClose={() => {
          setOpenDrawer(false);
        }}
        open={openDrawer}
        {...(md
          ? {
              width: 400,
            }
          : {
              width: '100%',
            })}
      >
        <ProductBonusPicker offers={offers} onUseOffer={onUseOffer} />

        <div className="px-4">
          <Input.Group compact className="mt-4 flex">
            <Input
              size="large"
              placeholder="Nhập mã ưu đãi"
              value={inputValue}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  onUseOffer(inputValue);
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
                onClick={() => onUseOffer(inputValue)}
              >
                Áp dụng
              </Button>
            </Form.Item>
          </Input.Group>
        </div>
      </NoPaddingContentDrawer>
    </div>
  );
}

export default OfferCodeInput;
