import { Grid, Modal, ModalProps } from 'antd';
import React from 'react';
import ProductImageCarousel from './ProductImageCarousel';
import styled from 'styled-components';

const FullScreenModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 0;
    min-height: 100vh;
  }
}`;

function ProductImageCarouselModal({
  images,
  defaultActiveIndex = 0,
  ...modalProps
}: ModalProps & {
  images: string[];
  defaultActiveIndex?: number;
}) {
  const { lg } = Grid.useBreakpoint();
  const ModalContainer = lg ? Modal : FullScreenModal;

  return (
    <ModalContainer
      className={
        lg ? 'large' : 'small top-0 m-0 min-h-[100vh] min-w-[100vw] p-0'
      }
      width={lg ? 1000 : undefined}
      {...modalProps}
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
      <ProductImageCarousel
        images={images}
        type="in-modal"
        generateThumbnailContainerId={() => 'image-thumbnail-container-modal'}
        generateThumbnailId={(index) => 'image-' + index + '-thumbnail-modal'}
        defaultActiveIndex={defaultActiveIndex}
      ></ProductImageCarousel>
    </ModalContainer>
  );
}

export default ProductImageCarouselModal;
