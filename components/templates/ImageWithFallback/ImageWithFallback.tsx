import ImageUtils from '@libs/utils/image.utils';
import Image, { ImageProps } from 'next/image';
import { useEffect, useState } from 'react';

function ImageWithFallback(
  props: ImageProps & {
    getMockImage?: () => string;
  }
) {
  const [src, setSrc] = useState('');

  useEffect(() => {
    setSrc(props.src as string);
  }, [props.src]);

  return (
    <Image
      alt={props.alt}
      placeholder="blur"
      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0wIDBoMTAwdjEwMEgwVjB6IiBmaWxsPSIjZmZmIi8+PC9zdmc+"
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
