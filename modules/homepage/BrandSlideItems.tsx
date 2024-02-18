import ImageWithFallback from '@components/templates/ImageWithFallback';
import LinkWrapper from '@components/templates/LinkWrapper';
import BrandModel from '@configs/models/brand.model';

function BrandSlideItems({ brand }: { brand: BrandModel }) {
  return (
    <LinkWrapper href={`/thuong-hieu/${brand.seoUrl}`} className="primary">
      <div className="flex  h-[200px] max-h-[300px] flex-col items-center rounded-xl border-solid border-white bg-white shadow-md hover:cursor-pointer hover:border-primary lg:h-[250px]">
        <div>
          <ImageWithFallback
            src={brand?.image || ''}
            alt="brand logo"
            width={160}
            height={160}
            className="p-4"
          />
        </div>

        <div className=" text-md mt-1 px-1 pb-6 lg:text-lg">{brand.name}</div>
      </div>
    </LinkWrapper>
  );
}

export default BrandSlideItems;
