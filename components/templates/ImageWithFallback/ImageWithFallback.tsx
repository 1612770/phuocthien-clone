import ImageUtils from '@libs/utils/image.utils';
import Image, { ImageProps } from 'next/image';
import { useEffect, useState } from 'react';

function ImageWithFallback(
  props: ImageProps & {
    getMockImage?: () => string;
  }
) {
  const [src, setSrc] = useState<any>();

  useEffect(() => {
    setSrc(props.src);
  }, [props.src]);

  return (
    <Image
      alt={props.alt}
      onError={() => {
        setSrc(
          props.getMockImage
            ? props.getMockImage()
            : ImageUtils.getRandomMockMenuUrl()
        );
      }}
      {...props}
      src={src}
    />
  );
}

export default ImageWithFallback;
