import { Button, Grid, Input, Radio, Space, Tooltip, Typography } from 'antd';
import Product, {
  CartCombo,
  CartDeal,
  CartGift,
  CartProduct,
} from '@configs/models/product.model';
import { useCart } from '@providers/CartProvider';
import ImageWithFallback from '@components/templates/ImageWithFallback';
import { useEffect, useRef, useState } from 'react';
import CartProductItemNoteInput from './CartProductItemNoteInput';
import {
  getLargestMatchedMinConditionProduct,
  useCheckout,
} from '@providers/CheckoutProvider';
import { ProductClient } from '@libs/client/Product';
import { useAppConfirmDialog } from '@providers/AppConfirmDialogProvider';
import CurrencyUtils from '@libs/utils/currency.utils';
import CartProductItemCollapse from './CartProductItemCollapse';
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import LinkWrapper from '@components/templates/LinkWrapper';
import CartItemComboDetailCollapsse from './CartItemComboDetailCollapsse';
import { getProductName } from '@libs/helpers';
import CartItemGiftDetailCollapsse from './CartItemGiftDetailCollapsse';
import CartItemDealDetailCollapsse from './CartItemDealDetailCollapsse';

function CartItem({
  cartProduct,
  cartCombo,
  cartDeal,
  cartGift,
  checkInventory,
}: {
  cartProduct?: CartProduct;
  cartCombo?: CartCombo;
  cartDeal?: CartDeal;
  cartGift?: CartGift;
  checkInventory?: {
    product: Product;
    statusData: {
      isStillAvailable: boolean;
      drugstoreQuantity?: number;
    };
  };
}) {
  const [quantity, setQuantity] = useState<number>(0);

  const { removeFromCart, changeCartItemData } = useCart();
  const { checkoutForm, productStatuses, setProductStatuses, cartStep } =
    useCheckout();
  const { setConfirmData } = useAppConfirmDialog();
  const quantityInputRef = useRef(1);

  const checkNewQuantityFitDrugstoreQuantity = async (newQuantity: number) => {
    const product = new ProductClient(null, {});
    const checkInventoryAtDrugStoresResponse =
      await product.checkInventoryAtDrugStores({
        key: cartProduct?.product?.key || '',
      });

    const foundDrugstore = (checkInventoryAtDrugStoresResponse.data || []).find(
      (inventoryAtDrugStore) =>
        inventoryAtDrugStore?.drugstore.key ===
        checkoutForm?.getFieldValue('currentDrugStoreKey')
    );

    if (!foundDrugstore) {
      setConfirmData({
        title: 'Sản phẩm không còn ở nhà thuốc',
        content:
          'Sản phẩm này không còn trong kho của nhà thuốc này. Xác nhận loại bỏ khỏi giỏ hàng sản phẩm này?',
        onOk: () => {
          // filter out the product that has been updated
          setProductStatuses(
            productStatuses.filter((productStatus) => {
              return productStatus.product.key !== cartProduct?.product?.key;
            })
          );

          removeFromCart(
            { product: cartProduct?.product },
            {
              isShowConfirm: false,
            }
          );
        },
        onCancel: () => {
          setQuantity(quantityInputRef.current);
        },
      });

      return false;
    }

    if (foundDrugstore.quantity < newQuantity) {
      setConfirmData({
        title: 'Số lượng sản phẩm không đủ',
        content: `Số lượng sản phẩm này không đủ trong kho của nhà thuốc này. Số lượng sản phẩm trong kho là ${foundDrugstore.quantity}. Xác nhận cập nhật lại giỏ hàng?`,
        onOk: () => {
          // filter out the product that has been updated
          setProductStatuses(
            productStatuses.filter(
              (productStatus) =>
                productStatus.product.key !== cartProduct?.product?.key
            )
          );

          if (cartProduct?.product) {
            changeCartItemData(
              { product: cartProduct?.product },
              {
                field: 'quantity',
                value: foundDrugstore.quantity,
              }
            );
          }
        },
        onCancel: () => {
          setQuantity(quantityInputRef.current);
        },
      });

      return false;
    }

    if (
      cartProduct?.product ||
      cartCombo?.comboPromotion ||
      cartDeal?.dealPromotion ||
      cartGift?.giftPromotion
    ) {
      changeCartItemData(
        {
          product: cartProduct?.product,
          comboPromotion: cartCombo?.comboPromotion,
          dealPromotion: cartDeal?.dealPromotion,
          giftPromotion: cartGift?.giftPromotion,
        },
        {
          field: 'quantity',
          value: newQuantity,
        }
      );
    }
    return true;
  };

  const processWhenChangeQuantity = (newQuantity: number) => {
    if (
      cartProduct?.product &&
      checkoutForm?.getFieldValue('currentDrugStoreKey')
    ) {
      checkNewQuantityFitDrugstoreQuantity(newQuantity);
    } else if (
      cartProduct?.product ||
      cartCombo?.comboPromotion ||
      cartDeal?.dealPromotion ||
      cartGift?.giftPromotion
    ) {
      changeCartItemData(
        {
          product: cartProduct?.product,
          comboPromotion: cartCombo?.comboPromotion,
          dealPromotion: cartDeal?.dealPromotion,
          giftPromotion: cartGift?.giftPromotion,
        },
        {
          field: 'quantity',
          value: newQuantity,
        }
      );
    }
  };

  useEffect(() => {
    if (cartProduct?.product) {
      setQuantity(cartProduct?.quantity || 0);
    }
  }, [cartProduct]);

  useEffect(() => {
    if (cartCombo?.comboPromotion) {
      setQuantity(cartCombo?.quantity || 0);
    }
  }, [cartCombo]);

  useEffect(() => {
    if (cartDeal?.dealPromotion) {
      setQuantity(cartDeal?.quantity || 0);
    }
  }, [cartDeal]);

  useEffect(() => {
    if (cartGift?.giftPromotion) {
      setQuantity(cartGift?.quantity || 0);
    }
  }, [cartGift]);

  const productPromotionPercent = getLargestMatchedMinConditionProduct(
    cartProduct?.product?.promotions || [],
    cartProduct?.quantity || 0
  );

  const displayName = cartCombo
    ? cartCombo?.comboPromotion.name
    : cartDeal
    ? ''
    : cartGift
    ? ''
    : getProductName(cartProduct?.product);
  const price = CurrencyUtils.format(
    cartCombo
      ? cartCombo.comboPromotion.totalAmount
      : cartDeal
      ? cartDeal.dealPromotion.totalAmount
      : cartGift
      ? cartGift.giftPromotion.policies?.reduce(
          (acc, cur) => acc + (cur.prodInfo?.retailPrice || 0),
          0
        )
      : cartProduct?.product?.retailPrice
  );
  const priceWithDiscount = cartCombo
    ? CurrencyUtils.format(cartCombo.comboPromotion.totalCost)
    : cartDeal
    ? CurrencyUtils.format(cartDeal.dealPromotion.totalCost)
    : cartGift
    ? CurrencyUtils.format(0)
    : CurrencyUtils.formatWithDiscount(
        cartProduct?.product?.retailPrice,
        productPromotionPercent?.val
      );

  const isDiscount = cartCombo
    ? true
    : cartDeal
    ? true
    : cartGift
    ? false
    : ((cartProduct?.quantity || 0) >=
        (productPromotionPercent?.productQuantityMinCondition || 0) &&
        productPromotionPercent?.val) ||
      0 > 0;

  const cartItemQuantity = cartCombo
    ? cartCombo.quantity
    : cartDeal
    ? cartDeal.quantity
    : cartGift
    ? cartGift.quantity
    : cartProduct?.quantity;

  const cartItemChoosen = cartCombo
    ? cartCombo?.choosen
    : cartDeal
    ? cartDeal?.choosen
    : cartGift
    ? cartGift?.choosen
    : cartProduct?.choosen;

  const cartUnit = cartCombo
    ? 'Combo'
    : cartDeal
    ? 'Deal'
    : cartGift
    ? 'Quà'
    : cartProduct?.product?.unit || '';

  const { xl } = Grid.useBreakpoint();
  const productMeta = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex shrink-0 basis-[112px] flex-col">
        <Typography.Text className="">
          <Typography.Text className="text-sm font-semibold">
            {isDiscount ? priceWithDiscount : price}
          </Typography.Text>
        </Typography.Text>
        {isDiscount && (
          <Typography.Text className="text-left text-xs font-semibold text-gray-500 line-through">
            {price}
          </Typography.Text>
        )}
      </div>

      {cartStep === 'cart' && (
        <div className="flex shrink-0 basis-[80px] items-center">
          {cartUnit && (
            <Typography.Text className=" whitespace-nowrap text-sm ">
              {cartUnit}
            </Typography.Text>
          )}
        </div>
      )}

      {cartStep === 'cart' && (
        <Space size={4} className="shrink-0 basis-[160px] sm:ml-auto">
          <Button
            icon={<MinusOutlined />}
            disabled={(cartItemQuantity || 0) <= 1}
            onClick={() => {
              if ((cartItemQuantity || 0) > 1) {
                quantityInputRef.current = cartItemQuantity || 0;
                processWhenChangeQuantity((cartItemQuantity || 0) - 1);
              }
            }}
          ></Button>
          <Input
            className="w-[46px] text-center"
            value={quantity || ''}
            onFocus={(e) => {
              quantityInputRef.current = +e.target.value || 1;
            }}
            onBlur={(e) => {
              let newQuantity = +e.target.value;
              if (newQuantity < 1) {
                newQuantity = quantityInputRef.current;
              }

              processWhenChangeQuantity(newQuantity);
            }}
            max={50}
            onChange={(e) => {
              setQuantity(+e.target.value);
            }}
          ></Input>
          <Button
            icon={<PlusOutlined />}
            onClick={() => {
              quantityInputRef.current = cartItemQuantity || 0;
              processWhenChangeQuantity((cartItemQuantity || 0) + 1);
            }}
          ></Button>

          <Tooltip title="Xóa sản phẩm" placement="top">
            <Button
              onClick={() =>
                removeFromCart({
                  product: cartProduct?.product,
                  comboPromotion: cartCombo?.comboPromotion,
                  dealPromotion: cartDeal?.dealPromotion,
                  giftPromotion: cartGift?.giftPromotion,
                })
              }
              ghost
              shape="circle"
              className=" bg-red-500 hover:bg-stone-100"
              icon={
                <DeleteOutlined
                  style={{
                    fontSize: '16px',
                  }}
                />
              }
            ></Button>
          </Tooltip>
        </Space>
      )}

      {cartStep === 'checkout' && (
        <Typography.Text className="text-right text-sm text-gray-500">
          x {quantity} {cartProduct?.product?.unit}
        </Typography.Text>
      )}
      {checkInventory && !checkInventory.statusData.isStillAvailable && (
        <div className="text-red-700">
          Hiện tại mặt hàng này không đủ số lượng bạn yêu cầu.
          <br /> Tổng số lượng sản phẩm hiện tại là:{' '}
          <b>{checkInventory.statusData.drugstoreQuantity}</b>
          <br />
          Vui lòng cập nhật lại giỏ hàng.
        </div>
      )}
    </div>
  );

  return (
    <div
      className={`group -mx-4 select-none py-4 px-4 transition-all duration-200 ease-in-out hover:bg-stone-50 ${
        checkInventory && !checkInventory?.statusData.isStillAvailable
          ? 'bg-red-50 hover:bg-red-100'
          : ''
      }`}
    >
      <div className="flex items-center justify-start gap-1 xl:justify-between ">
        {cartStep === 'cart' && (
          <Radio
            checked={cartItemChoosen}
            onClick={() => {
              if (
                cartProduct?.product ||
                cartCombo?.comboPromotion ||
                cartDeal?.dealPromotion ||
                cartGift?.giftPromotion
              ) {
                changeCartItemData(
                  {
                    product: cartProduct?.product,
                    comboPromotion: cartCombo?.comboPromotion,
                    dealPromotion: cartDeal?.dealPromotion,
                    giftPromotion: cartGift?.giftPromotion,
                  },
                  {
                    field: 'choosen',
                    value: !cartItemChoosen,
                  }
                );
              }
            }}
          />
        )}

        <div className="flex flex-1 flex-col">
          <div className="flex">
            {cartProduct && (
              <div className="relative mr-2 flex h-[60px] min-h-[60px] w-[60px] min-w-[60px] flex-col">
                <ImageWithFallback
                  src={cartProduct?.product?.detail?.image || ''}
                  alt="product image"
                  layout="fill"
                />
              </div>
            )}

            <div className="flex flex-col">
              {cartProduct && (
                <LinkWrapper
                  href={`/${cartProduct?.product?.productType?.seoUrl}/${cartProduct?.product?.detail?.seoUrl}`}
                >
                  <Typography.Text className="mt-2">
                    {displayName}
                  </Typography.Text>
                </LinkWrapper>
              )}

              {cartCombo && (
                <Typography.Text className="mt-2">
                  {displayName}
                </Typography.Text>
              )}

              {cartCombo && (
                <CartItemComboDetailCollapsse cartCombo={cartCombo} />
              )}
              {cartDeal && <CartItemDealDetailCollapsse cartDeal={cartDeal} />}
              {cartGift && <CartItemGiftDetailCollapsse cartGift={cartGift} />}

              {!!cartProduct && (
                <CartProductItemNoteInput cartProduct={cartProduct} />
              )}

              {(cartProduct?.product?.promotions?.length || 0) > 0 && (
                <CartProductItemCollapse
                  promotionPercents={cartProduct?.product?.promotions || []}
                />
              )}
            </div>
          </div>

          {!xl && <div className="ml-[60px]">{productMeta}</div>}
        </div>

        {xl && (
          <div
            className={`shrink-0 ${
              cartStep === 'cart' ? 'basis-[380px]' : 'basis-[200px]'
            }`}
          >
            {productMeta}
          </div>
        )}
      </div>
    </div>
  );
}

export default CartItem;
