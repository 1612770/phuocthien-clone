import { Button, Grid, Input, Radio, Space, Tooltip, Typography } from 'antd';
import { CartProduct } from '@configs/models/product.model';
import { useCart } from '@providers/CartProvider';
import ImageWithFallback from '@components/templates/ImageWithFallback';
import { useEffect, useRef, useState } from 'react';
import CartProductItemNoteInput from './CartProductItemNoteInput';
import { useCheckout } from '@providers/CheckoutProvider';
import { ProductClient } from '@libs/client/Product';
import { useAppConfirmDialog } from '@providers/AppConfirmDialogProvider';
import CurrencyUtils from '@libs/utils/currency.utils';
import CartProductItemCollapse from './CartProductItemCollapse';
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import LinkWrapper from '@components/templates/LinkWrapper';

function CartProductItem({ cartProduct }: { cartProduct: CartProduct }) {
  const [quantity, setQuantity] = useState<number>(0);

  const { removeFromCart, changeProductData } = useCart();
  const { checkoutForm, productStatuses, setProductStatuses, cartStep } =
    useCheckout();
  const { setConfirmData } = useAppConfirmDialog();
  const quantityInputRef = useRef(1);

  const checkNewQuantityFitDrugstoreQuantity = async (newQuantity: number) => {
    const product = new ProductClient(null, {});
    const checkInventoryAtDrugStoresResponse =
      await product.checkInventoryAtDrugStores({
        key: cartProduct.product.key || '',
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
              return productStatus.product.key !== cartProduct.product.key;
            })
          );

          removeFromCart(cartProduct.product, {
            isShowConfirm: false,
          });
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
                productStatus.product.key !== cartProduct.product.key
            )
          );

          changeProductData(cartProduct.product, {
            field: 'quantity',
            value: foundDrugstore.quantity,
          });
        },
        onCancel: () => {
          setQuantity(quantityInputRef.current);
        },
      });

      return false;
    }

    changeProductData(cartProduct.product, {
      field: 'quantity',
      value: newQuantity,
    });
    return true;
  };

  const processWhenChangeQuantity = (newQuantity: number) => {
    if (checkoutForm?.getFieldValue('currentDrugStoreKey')) {
      checkNewQuantityFitDrugstoreQuantity(newQuantity);
    } else {
      changeProductData(cartProduct.product, {
        field: 'quantity',
        value: newQuantity,
      });
    }
  };

  useEffect(() => {
    setQuantity(cartProduct.quantity);
  }, [cartProduct]);

  const productPromotionPercent = cartProduct.product?.promotions?.[0];
  const displayName =
    cartProduct.product?.detail?.displayName || cartProduct.product.name;
  const price = CurrencyUtils.format(cartProduct.product?.retailPrice);
  const priceWithDiscount = CurrencyUtils.formatWithDiscount(
    cartProduct.product?.retailPrice,
    productPromotionPercent?.val
  );

  const isDiscount =
    (cartProduct.quantity >=
      (productPromotionPercent?.productQuantityMinCondition || 0) &&
      productPromotionPercent?.val) ||
    0 > 0;

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
          {cartProduct.product.unit && (
            <Typography.Text className=" whitespace-nowrap text-sm ">
              {cartProduct.product.unit}
            </Typography.Text>
          )}
        </div>
      )}

      {cartStep === 'cart' && (
        <Space size={4} className="shrink-0 basis-[160px] sm:ml-auto">
          <Button
            icon={<MinusOutlined />}
            disabled={cartProduct.quantity <= 1}
            onClick={() => {
              if (cartProduct.quantity > 1) {
                quantityInputRef.current = cartProduct.quantity;
                processWhenChangeQuantity(cartProduct.quantity - 1);
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
            onChange={(e) => {
              setQuantity(+e.target.value);
            }}
          ></Input>
          <Button
            icon={<PlusOutlined />}
            onClick={() => {
              quantityInputRef.current = cartProduct.quantity;
              processWhenChangeQuantity(cartProduct.quantity + 1);
            }}
          ></Button>

          <Tooltip title="Xóa sản phẩm" placement="top">
            <Button
              onClick={() => removeFromCart(cartProduct.product)}
              type="ghost"
              shape="circle"
              className=" bg-stone-50 hover:bg-stone-100"
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
          x {quantity} {cartProduct.product.unit}
        </Typography.Text>
      )}
    </div>
  );

  return (
    <div className="group -mx-4 select-none py-4 px-4 transition-all duration-200 ease-in-out hover:bg-stone-50 ">
      <div className="flex items-center justify-start gap-1 xl:justify-between ">
        {cartStep === 'cart' && (
          <Radio
            checked={cartProduct.choosen}
            onClick={() => {
              changeProductData(cartProduct.product, {
                field: 'choosen',
                value: !cartProduct.choosen,
              });
            }}
          />
        )}

        <div className="flex flex-1 flex-col">
          <div className="flex">
            <div className="relative mr-2 flex h-[60px] min-h-[60px] w-[60px] min-w-[60px] flex-col">
              <ImageWithFallback
                src={cartProduct.product.detail?.image || ''}
                alt="product image"
                layout="fill"
              />
            </div>

            <div className="flex flex-col">
              <LinkWrapper
                href={`/${cartProduct.product.productType?.seoUrl}/${cartProduct.product.detail?.seoUrl}`}
              >
                <Typography.Text className="mt-2">
                  {displayName}
                </Typography.Text>
              </LinkWrapper>

              <CartProductItemNoteInput cartProduct={cartProduct} />

              {(cartProduct.product.promotions?.length || 0) > 0 && (
                <CartProductItemCollapse
                  promotionPercents={cartProduct.product.promotions || []}
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

export default CartProductItem;
