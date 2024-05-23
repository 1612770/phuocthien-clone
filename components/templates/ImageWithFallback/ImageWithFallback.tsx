import ImageUtils from '@libs/utils/image.utils';
import Image, { ImageProps } from 'next/image';
import { useMemo, useState } from 'react';

function ImageWithFallback({
  getMockImage,
  src,
  ...props
}: ImageProps & {
  getMockImage?: () => string;
}) {
  const [isImageLoadFailed, setisImageLoadFailed] = useState(false);

  const imageSource = useMemo(() => {
    if (isImageLoadFailed) {
      return getMockImage ? getMockImage() : '/image-placeholder.png';
    }

    if (typeof src === 'string') return ImageUtils.getFullImageUrl(src);

    return src;
  }, [isImageLoadFailed, src, getMockImage]);

  return (
    <Image
      alt={props?.alt || 'default'}
      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0wIDBoMTAwdjEwMEgwVjB6IiBmaWxsPSIjZmZmIi8+PC9zdmc+"
      onError={() => {
        setisImageLoadFailed(true);
      }}
      {...props}
      src={imageSource}
    />
  );
}

export default ImageWithFallback;
