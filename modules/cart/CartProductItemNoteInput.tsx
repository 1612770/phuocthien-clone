import { Button, Form, Input, Modal, Typography } from 'antd';
import Product from '@configs/models/product.model';
import { useCart } from '@providers/CartProvider';
import { useEffect, useRef, useState } from 'react';
import { TextAreaRef } from 'antd/es/input/TextArea';
import { EditOutlined } from '@ant-design/icons';

function CartProductItemNoteInput({
  cartProduct,
}: {
  cartProduct: { product?: Product; quantity: number; note?: string };
}) {
  const [form] = Form.useForm();
  const inputRef = useRef<TextAreaRef | null>(null);

  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const { changeCartItemData } = useCart();

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
        className={`h-auto justify-start p-0 text-gray-500`}
        onClick={() => {
          inputRef.current?.focus();
          setOpen(true);
        }}
      >
        <div className="mt-2 flex justify-start gap-2">
          <EditOutlined className="text-blue-500" />
          <Typography.Text
            className={`${
              cartProduct.note ? 'text-blue-500' : 'text-gray-500'
            } whitespace-pre-wrap text-left text-xs`}
          >
            &nbsp;
            {cartProduct.note ? `Ghi chú: ${cartProduct.note}` : 'Thêm ghi chú'}
          </Typography.Text>
        </div>
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
            Nhập ghi chú cho sản phẩm&nbsp;
            {cartProduct.product?.detail?.displayName}
          </Typography>
        }
      >
        <Form
          form={form}
          onFinish={() => {
            if (cartProduct.product) {
              changeCartItemData(
                { product: cartProduct.product },
                {
                  field: 'note',
                  value: inputValue,
                }
              );
            }
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
