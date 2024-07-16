import AppDangerouslySetInnerHTML from '@components/AppDangerouslySetInnerHTML';
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
    <div className="relative">
      <div className="lg:container lg:pl-0">
        <Typography.Title
          level={3}
          className="mb-0 font-medium capitalize  lg:mb-4 "
        >
          Thông tin sản phẩm
        </Typography.Title>
      </div>

      <AppDangerouslySetInnerHTML
        {...props}
        className=" max-h-[500px] overflow-hidden text-lg md:text-base"
        ref={(ref) => {
          divRef.current = ref;
        }}
      ></AppDangerouslySetInnerHTML>
      {showViewMoreButton && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white to-transparent">
          <div className="flex h-full w-full items-center justify-center bg-transparent pt-16">
            <Button
              type="primary"
              className="shadown-none"
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
            <Typography.Title level={4}>Thông tin sản phẩm</Typography.Title>
          </Typography>
        }
        footer={null}
        style={{ top: 20, bottom: 20 }}
        open={openFullModal}
        onOk={() => setOpenFullModal(false)}
        onCancel={() => setOpenFullModal(false)}
        width={1000}
      >
        <div className="">
          <div {...props}></div>
        </div>
      </Modal>
    </div>
  );
}

export default ProductCardDetail;
