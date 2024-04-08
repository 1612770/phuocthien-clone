import { List } from 'antd';
import ImageUtils from '@libs/utils/image.utils';
import { useRouter } from 'next/router';

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
    </div>
  );
}

export default PrimaryHeaderMenuAllPopoverContentLeftItem;
