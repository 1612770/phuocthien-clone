import { Modal } from 'antd';

function PrescriptionGuidelinesModal({
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
      title="Quy trình tư vấn thuốc"
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

export default PrescriptionGuidelinesModal;
