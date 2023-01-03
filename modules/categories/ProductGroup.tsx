import ImageWithFallback from '@components/templates/ImageWithFallback';
import ProductGroupModel from '@configs/models/product-group.model';
import ImageUtils from '@libs/utils/image.utils';
import { Typography } from 'antd';
import Link from 'next/link';

function ProductGroup({
  productGroup,
  href,
}: {
  productGroup?: ProductGroupModel;
  href: string;
}) {
  if (!productGroup) return null;
  if (typeof productGroup?.visible === 'boolean' && !productGroup?.visible) {
    return null;
  }

  return (
    <Link href={href}>
      <a>
        <div className="flex min-h-[164px] w-[160px] flex-col items-center justify-center rounded-lg border border-solid border-gray-200 px-2 py-4">
          <ImageWithFallback
            src={ImageUtils.getFullImageUrl(productGroup?.image)}
            alt={productGroup?.name || 'product group image'}
            width={48}
            height={48}
          />
          <Typography className="mb-1 mt-3 min-h-[44px] text-center">
            {productGroup?.name}
          </Typography>
        </div>
      </a>
    </Link>
  );
}

export default ProductGroup;
