import ImageWithFallback from '@components/templates/ImageWithFallback';

function ProductImages({ imageUrls }: { imageUrls: string[] }) {
  if (!imageUrls.length) return null;

  return (
    <div className="relative -mx-4 flex h-full w-full overflow-hidden rounded-lg rounded-bl-none rounded-br-none border-0 border-solid border-gray-100 bg-white md:mx-0 md:rounded-bl-lg md:rounded-br-lg md:border">
      {imageUrls.slice(0, 3).map((url, index) => (
        <div
          className="relative h-full border-0 border-solid border-gray-100 md:border"
          key={index}
          style={{
            width: `calc(100% / ${imageUrls.length})`,
            ...(index === 0 && {
              borderTopLeftRadius: '0.5rem',
              borderBottomLeftRadius: '0.5rem',
            }),
            ...(index === imageUrls.length - 1 && {
              borderTopRightRadius: '0.5rem',
              borderBottomRightRadius: '0.5rem',
            }),
          }}
        >
          <ImageWithFallback
            src={url}
            priority
            alt="product"
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            style={{ width: `cacl(100% / ${imageUrls.length})` }}
          />
        </div>
      ))}
    </div>
  );
}

export default ProductImages;
