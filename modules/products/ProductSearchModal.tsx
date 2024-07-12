import { Modal } from "antd";

function ProductSearchModal({
  open,
  handleCancel,
  children,
}: {
  open: boolean;
  handleCancel: () => void;
  children: React.ReactNode;
}) {
  return (
    <Modal
      title="Thêm sản phẩm cần tư vấn"
      open={open}
      onCancel={handleCancel}
      width={800}
      okButtonProps={{
        style: {
          display: 'none',
        },
      }}
      cancelButtonProps={{
        style: {
          display: 'none',
        },
      }}
    >
      <div className="py-2">{children}</div>
    </Modal>
  );
}

export default ProductSearchModal;