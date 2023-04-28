import { Button, Input, Space, Typography } from 'antd';
import Product from '@configs/models/product.model';
import { useCart } from '@providers/CartProvider';
import ImageWithFallback from '@components/templates/ImageWithFallback';
import { useEffect, useRef, useState } from 'react';
import CartProductItemNoteInput from './CartProductItemNoteInput';
import { useCheckout } from '@providers/CheckoutProvider';
import { ProductClient } from '@libs/client/Product';
import { useAppConfirmDialog } from '@providers/AppConfirmDialogProvider';
import Link from 'next/link';
import UrlUtils from '@libs/utils/url.utils';
import CurrencyUtils from '@libs/utils/currency.utils';
import CartProductItemCollapse from './CartProductItemCollapse';
import { CloseOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';

function CartProductItem({
  cartProduct,
}: {
  cartProduct: { product: Product; quantity: number; note?: string };
}) {
  const [quantity, setQuantity] = useState<number>(0);

  const { removeFromCart, changeProductData } = useCart();
  const { checkoutForm, productStatuses, setProductStatuses } = useCheckout();
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

  return (
    <div className="group -mx-4 flex select-none justify-between py-4 px-4 transition-all duration-200 ease-in-out hover:bg-stone-50">
      <div className="mr-4 flex flex-col items-center ">
        <div className="relative flex h-[60px] w-[60px] flex-col">
          <ImageWithFallback
            src={cartProduct.product.detail?.image || ''}
            alt="product image"
            layout="fill"
          />
        </div>
        <Button
          onClick={() => removeFromCart(cartProduct.product)}
          size="small"
          type="ghost"
          className="mt-2 inline-block bg-gray-200 px-2 py-0 text-xs "
          icon={<CloseOutlined className="" />}
        >
          Xóa
        </Button>
      </div>
      <div className="flex flex-grow flex-wrap gap-2">
        <div className="flex flex-grow basis-[300px] flex-col items-start">
          <Link
            href={`/san-pham/chi-tiet/${UrlUtils.generateSlug(
              displayName,
              cartProduct.product.key
            )}`}
          >
            <a>
              <Typography.Text className="mt-2">{displayName}</Typography.Text>
            </a>
          </Link>

          <CartProductItemNoteInput cartProduct={cartProduct} />

          {(cartProduct.product.promotions?.length || 0) > 0 && (
            <CartProductItemCollapse
              promotionPercents={cartProduct.product.promotions || []}
            />
          )}
        </div>
        <div className="meta flex flex-col">
          <Typography.Text className="text-right">
            <Typography.Text className="text-sm font-semibold">
              {isDiscount ? priceWithDiscount : price}
            </Typography.Text>

            {cartProduct.product.unit && (
              <Typography.Text className="text-sm">
                /{cartProduct.product.unit}
              </Typography.Text>
            )}
          </Typography.Text>
          {isDiscount && (
            <Typography.Text className="text-right text-xs font-semibold text-gray-500 line-through">
              {price}
            </Typography.Text>
          )}

          <Space size={4} className="mt-1 md:ml-auto md:mr-0">
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
          </Space>
        </div>
      </div>
    </div>
  );
}

export default CartProductItem;
