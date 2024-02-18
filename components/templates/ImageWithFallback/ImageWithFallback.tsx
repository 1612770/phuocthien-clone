import ImageUtils from '@libs/utils/image.utils';
import Image, { ImageProps } from 'next/image';
import { useEffect, useMemo, useState } from 'react';

function ImageWithFallback({
  getMockImage,
  ...props
}: ImageProps & {
  getMockImage?: () => string;
}) {
  const [src, setSrc] = useState('');
  const [isImageLoadFailed, setisImageLoadFailed] = useState(false);

  useEffect(() => {
    setSrc(props.src as string);
  }, [props.src]);

  const imageSource = useMemo(() => {
    if (isImageLoadFailed) {
      return getMockImage ? getMockImage() : '/image-placeholder.png';
    }

    return ImageUtils.getFullImageUrl(src);
  }, [isImageLoadFailed, src, getMockImage]);

  return (
    <Image
      alt={props?.alt || 'default'}
      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0wIDBoMTAwdjEwMEgwVjB6IiBmaWxsPSIjZmZmIi8+PC9zdmc+"
      onError={() => {
        setisImageLoadFailed(true);
      }}
      {...props}
      src={imageSource || '/'}
    />
  );
}

export default ImageWithFallback;
