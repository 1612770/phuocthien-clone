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
      <a className="group w-full">
        <div className="flex min-h-[130px] w-full flex-col items-center justify-center rounded-lg border border-solid border-gray-200 bg-white px-1 py-4 transition duration-300 group-hover:border-primary-light">
          <div className="transition-transform duration-300 group-hover:scale-110">
            <ImageWithFallback
              src={ImageUtils.getFullImageUrl(productGroup?.image)}
              alt={productGroup?.name || 'product group image'}
              width={40}
              height={40}
            />
          </div>
          <Typography className="mb-1 mt-3 max-h-[20px] overflow-visible text-center text-sm">
            {productGroup?.name}
          </Typography>
        </div>
      </a>
    </Link>
  );
}

export default ProductGroup;
