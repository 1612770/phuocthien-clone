import { Button, Input, Space, Typography } from 'antd';
import { Minus, Plus, X } from 'react-feather';
import Product from '@configs/models/product.model';
import { useCart } from '@providers/CartProvider';
import ImageWithFallback from '@components/templates/ImageWithFallback';
import ImageUtils from '@libs/utils/image.utils';
import { useEffect, useRef, useState } from 'react';
import CartProductItemNoteInput from './CartProductItemNoteInput';
import { useCheckout } from '@providers/CheckoutProvider';
import { ProductClient } from '@libs/client/Product';
import { useAppConfirmDialog } from '@providers/AppConfirmDialogProvider';
import Link from 'next/link';
import UrlUtils from '@libs/utils/url.utils';

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

  return (
    <div className="my-4 flex justify-between ">
      <div className="mr-4 flex flex-col items-center ">
        <div className="relative flex h-[60px] w-[60px] flex-col">
          <ImageWithFallback
            src={cartProduct.product.detail?.image || ''}
            alt="product image"
            getMockImage={() => {
              return ImageUtils.getRandomMockProductImageUrl();
            }}
            layout="fill"
          />
        </div>
        <Button
          onClick={() => removeFromCart(cartProduct.product)}
          size="small"
          type="ghost"
          className="mt-2 inline-block bg-gray-200 px-2 py-0 text-xs "
          icon={<X size={14} className=" align-text-top" />}
        >
          &nbsp;Xóa
        </Button>
      </div>
      <div className="flex flex-grow flex-wrap gap-2">
        <div className="flex flex-grow basis-[300px] flex-col items-start">
          <Link
            href={`/san-pham/${UrlUtils.generateSlug(
              cartProduct.product.productType?.name,
              cartProduct.product.productType?.key
            )}/${UrlUtils.generateSlug(
              cartProduct.product.productGroup?.name,
              cartProduct.product.productGroup?.key
            )}/${UrlUtils.generateSlug(
              cartProduct.product.detail?.displayName,
              cartProduct.product.key
            )}`}
          >
            <a>
              <Typography.Text className="mt-2">
                {cartProduct.product.detail?.displayName}
              </Typography.Text>
            </a>
          </Link>

          <CartProductItemNoteInput cartProduct={cartProduct} />
        </div>
        <div className="meta flex flex-col">
          <Typography.Text className="text-right">
            <Typography.Text className="text-sm font-semibold">
              {cartProduct.product.retailPrice?.toLocaleString('it-IT', {
                style: 'currency',
                currency: 'VND',
              })}
            </Typography.Text>

            {cartProduct.product.unit && (
              <Typography.Text className="text-sm">
                /{cartProduct.product.unit}
              </Typography.Text>
            )}
          </Typography.Text>

          <Space size={4} className="mt-1">
            <Button
              icon={<Minus size={20} />}
              disabled={cartProduct.quantity <= 1}
              onClick={() => {
                if (cartProduct.quantity > 1) {
                  quantityInputRef.current = cartProduct.quantity;
                  processWhenChangeQuantity(cartProduct.quantity - 1);
                }
              }}
            ></Button>
            <Input
              className="w-[40px]"
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
              icon={<Plus size={20} />}
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
