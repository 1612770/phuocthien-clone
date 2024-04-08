import ImageUtils from '@libs/utils/image.utils';
import { Typography } from 'antd';
import { useRouter } from 'next/router';

function ProductChildGroup({
  label,
  href,
  image,
}: {
  label: string;
  href: string;
  image?: string;
}) {
  const router = useRouter();
  return (
    <div onClick={() => router.push(href)}>
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
          <Typography className="two-line-text mr-2">{label}</Typography>
        </div>
      </a>
    </div>
  );
}

export default ProductChildGroup;
