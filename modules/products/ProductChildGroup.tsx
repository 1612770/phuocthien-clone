import ImageUtils from '@libs/utils/image.utils';
import { Typography } from 'antd';
import Link from 'next/link';

function ProductChildGroup({
  label,
  href,
  image,
}: {
  label: string;
  href: string;
  image?: string;
}) {
  return (
    <Link href={href}>
      <a>
        <div className="group flex cursor-pointer items-center rounded-full border border-solid border-gray-200 bg-white p-2 py-1 hover:border-primary-light">
          <img
            className="mr-2 h-[40px] w-[40px] rounded-full border border-solid border-gray-200 group-hover:border-primary-light"
            src={ImageUtils.getProductChildGroupImageUrl(image)}
            onError={(e) => {
              e.currentTarget.src = ImageUtils.getRandomMockMenuUrl();
            }}
            alt={label}
          />
          <Typography className="mr-2">{label}</Typography>
        </div>
      </a>
    </Link>
  );
}

export default ProductChildGroup;
