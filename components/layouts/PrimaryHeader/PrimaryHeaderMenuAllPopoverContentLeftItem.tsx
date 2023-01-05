import { List } from 'antd';
import ImageUtils from '@libs/utils/image.utils';
import Link from 'next/link';

function PrimaryHeaderMenuAllPopoverContentLeftItem({
  href,
  active,
  onMouseEnter,
  label,
  image,
}: {
  href: string;
  active: boolean;
  onMouseEnter: () => void;
  label: string;
  image: string;
}) {
  return (
    <Link href={href}>
      <a
        className={
          active
            ? `border-b-1 border-t-1 block cursor-pointer border-l-0 border-solid border-t-green-200 border-b-green-200 border-r-primary-background bg-primary-background first:border-t-primary-background last:border-b-primary-background hover:border-r-primary-background hover:border-t-green-200 hover:border-b-green-200 hover:bg-primary-background first:hover:border-t-primary-background last:hover:border-b-primary-background`
            : `border-b-1 border-t-1 block cursor-pointer border-l-0 border-solid border-t-white border-b-white border-r-green-200 hover:border-r-primary-background hover:border-t-green-200 hover:border-b-green-200 hover:bg-primary-background first:hover:border-t-primary-background last:hover:border-b-primary-background`
        }
      >
        <List.Item onMouseEnter={onMouseEnter}>
          <img
            src={ImageUtils.getFullMenuImageUrl(image)}
            alt={label}
            onError={(e) => {
              e.currentTarget.src = ImageUtils.getRandomMockMenuUrl();
            }}
            className="mr-2 aspect-square w-8"
          />
          {label}
        </List.Item>
      </a>
    </Link>
  );
}

export default PrimaryHeaderMenuAllPopoverContentLeftItem;
