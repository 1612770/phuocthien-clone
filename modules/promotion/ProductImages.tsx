import ImageWithFallback from '@components/templates/ImageWithFallback';

function ProductImages({ imageUrls }: { imageUrls: string[] }) {
  if (!imageUrls.length) return null;

  return (
    <div className="bg-whie relative h-full w-full overflow-hidden rounded-lg border border-solid border-gray-200">
      <ImageWithFallback
        src={imageUrls[0]}
        priority
        alt="product"
        layout="fill"
        objectFit="cover"
        objectPosition="center"
      />

      {imageUrls[1] && (
        <div className="absolute bottom-0 left-0 overflow-hidden rounded-tr-full border border-solid border-gray-200 bg-white">
          <ImageWithFallback
            src={imageUrls[1]}
            priority
            alt="product"
            layout="fixed"
            objectFit="cover"
            width={120}
            height={120}
            objectPosition="center"
          />
        </div>
      )}
      {imageUrls[2] && (
        <div className="absolute bottom-0 right-0 overflow-hidden rounded-tl-full border border-solid border-gray-200 bg-white">
          <ImageWithFallback
            src={imageUrls[2]}
            priority
            alt="product"
            layout="fixed"
            objectFit="cover"
            width={120}
            height={120}
            objectPosition="center"
          />
        </div>
      )}
    </div>
  );
}

export default ProductImages;
