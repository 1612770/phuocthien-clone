import ImageUtils from '@libs/utils/image.utils';
import { Typography } from 'antd';
import Image from 'next/image';
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
    <Link href={href} passHref prefetch={false}>
      <a>
        <div className="group flex cursor-pointer items-center rounded-full border border-solid border-gray-200 bg-white p-2 py-1 hover:border-primary-light">
          <Image
            width={40}
            height={40}
            className="mr-2 rounded-full border border-solid border-gray-200 group-hover:border-primary-light"
            src={ImageUtils.getProductChildGroupImageUrl(image)}
            onError={(e) => {
              e.currentTarget.src = '/image-placeholder.png';
            }}
            alt={label}
            loading="lazy"
          />
          <Typography className="two-line-text mr-2">{label}</Typography>
        </div>
      </a>
    </Link>
  );
}

export default ProductChildGroup;
