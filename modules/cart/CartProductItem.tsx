import { Button, Form, Input, InputRef, Modal, Space, Typography } from 'antd';
import { Edit, Minus, Plus, X } from 'react-feather';
import Product from '@configs/models/product.model';
import { useCart } from '@providers/CartProvider';
import ImageWithFallback from '@components/templates/ImageWithFallback';
import ImageUtils from '@libs/utils/image.utils';
import { useEffect, useRef, useState } from 'react';
import { TextAreaRef } from 'antd/es/input/TextArea';

function CartProductItemNoteInput({
  cartProduct,
}: {
  cartProduct: { product: Product; quantity: number; note?: string };
}) {
  const [form] = Form.useForm();
  const inputRef = useRef<TextAreaRef | null>(null);

  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const { changeProductData } = useCart();

  useEffect(() => {
    setInputValue(cartProduct.note || '');
  }, [cartProduct]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  return (
    <>
      <Button
        type="link"
        className={`p-0 text-gray-500`}
        icon={<Edit size={14} className=" align-text-top" />}
        onClick={() => {
          inputRef.current?.focus();
          setOpen(true);
        }}
      >
        <Typography.Text
          className={`${cartProduct.note ? 'text-black-100' : 'text-gray-500'}`}
        >
          &nbsp;{cartProduct.note || 'Thêm ghi chú'}
        </Typography.Text>
      </Button>

      <Modal
        open={open}
        onOk={form.submit}
        onCancel={() => {
          setOpen(false);
        }}
        focusTriggerAfterClose={false}
        title={`Nhập ghi chú cho sản phẩm ${cartProduct.product.name}`}
      >
        <Form
          form={form}
          onFinish={() => {
            console.log('inputValue', inputValue);
            changeProductData(cartProduct.product, {
              field: 'note',
              value: inputValue,
            });
            setOpen(false);
          }}
        >
          <Input.TextArea
            rows={4}
            ref={(ref) => {
              inputRef.current = ref;
            }}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          ></Input.TextArea>
        </Form>
      </Modal>
    </>
  );
}

function CartProductItem({
  cartProduct,
}: {
  cartProduct: { product: Product; quantity: number; note?: string };
}) {
  const [quantity, setQuantity] = useState<number>(0);

  const { removeFromCart, changeProductData } = useCart();
  const quantityInputRef = useRef(1);

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
          <Typography.Text className="mt-2">
            {cartProduct.product.name}
          </Typography.Text>

          <CartProductItemNoteInput cartProduct={cartProduct} />
        </div>
        <div className="meta flex flex-col">
          <Typography.Text className="text-right">
            <Typography.Text className="text-sm font-semibold">
              {cartProduct.product.retailPrice
                ?.toLocaleString('it-IT', {
                  style: 'currency',
                  currency: 'VND',
                })
                .slice(0, -3)}
            </Typography.Text>
            VND
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
                if (cartProduct.quantity > 1)
                  changeProductData(cartProduct.product, {
                    field: 'quantity',
                    value: cartProduct.quantity - 1,
                  });
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

                changeProductData(cartProduct.product, {
                  field: 'quantity',
                  value: newQuantity,
                });
              }}
              onChange={(e) => {
                setQuantity(+e.target.value);
              }}
            ></Input>
            <Button
              icon={<Plus size={20} />}
              onClick={() =>
                changeProductData(cartProduct.product, {
                  field: 'quantity',
                  value: cartProduct.quantity + 1,
                })
              }
            ></Button>
          </Space>
        </div>
      </div>
    </div>
  );
}

export default CartProductItem;
