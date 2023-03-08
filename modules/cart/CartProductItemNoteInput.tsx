import { Button, Form, Input, Modal, Typography } from 'antd';
import { Edit } from 'react-feather';
import Product from '@configs/models/product.model';
import { useCart } from '@providers/CartProvider';
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
        okText="Lưu"
        cancelText="Hủy"
        focusTriggerAfterClose={false}
        title={
          <Typography className="text-base font-medium">
            Nhập ghi chú cho sản phẩm ${cartProduct.product.detail?.displayName}
          </Typography>
        }
      >
        <Form
          form={form}
          onFinish={() => {
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

export default CartProductItemNoteInput;
