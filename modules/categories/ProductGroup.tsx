import ImageWithFallback from '@components/templates/ImageWithFallback';
import { MenuProductGroup } from '@configs/constants/listMenu';
import ImageUtils from '@libs/utils/image.utils';
import { Typography } from 'antd';
import { useRouter } from 'next/router';

function ProductGroup({
  productGroup,
  href,
}: {
  productGroup?: MenuProductGroup;
  href: string;
}) {
  const router = useRouter();

  if (!productGroup) return null;

  return (
    <div onClick={() => router.push(href)} className="group w-full">
      <div className="flex min-h-[130px] w-full flex-col items-center justify-center rounded-lg border border-solid border-gray-200 bg-white px-1 py-4 transition duration-300 group-hover:border-primary-light">
        <div className="transition-transform duration-300 group-hover:scale-110">
          <ImageWithFallback
            src={ImageUtils.getFullImageUrl(productGroup?.productGroupImage)}
            alt={productGroup?.productGroupName || 'product group image'}
            width={40}
            height={40}
          />
        </div>
        <Typography className="mb-1 mt-3 max-h-[20px] overflow-visible text-center text-sm">
          {productGroup?.productGroupName}
        </Typography>
      </div>
    </div>
  );
}

export default ProductGroup;
