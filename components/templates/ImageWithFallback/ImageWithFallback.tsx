import ImageUtils from '@libs/utils/image.utils';
import Image, { ImageProps } from 'next/image';
import { useEffect, useState } from 'react';

function ImageWithFallback(props: ImageProps) {
  const [src, setSrc] = useState<any>();

  useEffect(() => {
    setSrc(props.src);
  }, [props.src]);

  return (
    <Image
      {...props}
      alt={props.alt}
      src={src}
      onError={() => {
        setSrc(ImageUtils.getRandomMockMenuUrl());
      }}
    />
  );
}

export default ImageWithFallback;
