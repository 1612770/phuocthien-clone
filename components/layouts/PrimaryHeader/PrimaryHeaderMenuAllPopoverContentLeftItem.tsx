import { List } from 'antd';
import ImageUtils from '@libs/utils/image.utils';
import { useRouter } from 'next/router';
import Image from 'next/image';

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
  const router = useRouter();
  return (
    <div
      className={
        'primary-popover-menu-item block cursor-pointer px-4 ' +
        (active
          ? `active bg-primary-background hover:bg-primary-background `
          : `hover:bg-primary-background`)
      }
      onClick={() => router.push(href)}
    >
      <List.Item
        onMouseEnter={onMouseEnter}
        className="flex items-center justify-start"
      >
        <Image
          src={ImageUtils.getFullMenuImageUrl(image)}
          alt={label}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = ImageUtils.getRandomMockMenuUrl();
          }}
          width={32}
          height={32}
          // className="mr-2"
        />
        {label}
      </List.Item>
    </div>
  );
}

export default PrimaryHeaderMenuAllPopoverContentLeftItem;
