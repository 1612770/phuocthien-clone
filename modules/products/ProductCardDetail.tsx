import { Button, Modal, Typography } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

function ProductCardDetail(
  props: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
) {
  const divRef = useRef<HTMLDivElement | null>(null);
  const [showViewMoreButton, setShowViewMoreButton] = useState(false);
  const [openFullModal, setOpenFullModal] = useState(false);

  useEffect(() => {
    setShowViewMoreButton((divRef.current?.scrollHeight || 0) > 500);
  }, [props.dangerouslySetInnerHTML?.__html]);

  return (
    <div className="relative pb-12">
      <div
        {...props}
        className=" product-detail-content max-h-[500px] overflow-hidden"
        ref={(ref) => {
          divRef.current = ref;
        }}
      ></div>
      {showViewMoreButton && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white to-transparent">
          <div className="flex h-full w-full items-center justify-center py-4">
            <Button
              type="primary"
              ghost
              onClick={() => {
                setOpenFullModal(true);
              }}
            >
              Xem thêm
            </Button>
          </div>
        </div>
      )}

      <Modal
        title={
          <Typography>
            <Typography.Title level={4}>Chi tiết sản phẩm</Typography.Title>
          </Typography>
        }
        footer={null}
        style={{ top: 20, bottom: 20 }}
        open={openFullModal}
        onOk={() => setOpenFullModal(false)}
        onCancel={() => setOpenFullModal(false)}
        width={1000}
      >
        <div className="product-detail-content">
          <div {...props}></div>
        </div>
      </Modal>
    </div>
  );
}

export default ProductCardDetail;
