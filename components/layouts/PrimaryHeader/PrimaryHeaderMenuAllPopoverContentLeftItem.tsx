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
          'primary-popover-menu-item block cursor-pointer ' +
          (active
            ? `active bg-primary-background hover:bg-primary-background `
            : `hover:bg-primary-background`)
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
