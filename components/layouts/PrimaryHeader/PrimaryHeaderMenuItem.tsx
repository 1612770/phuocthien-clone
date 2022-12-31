import { Popover, Space, Typography } from 'antd';
import Link from 'next/link';
import { ChevronDown } from 'react-feather';
import PrimaryHeaderMenuList from './PrimaryHeaderMenuList';
import ProductGroup from '@configs/models/product-group';

function PrimaryHeaderMenuItem({
  label,
  icon,

  onlyClick,
  href,
  productGroups,
}: {
  label: string;
  href: string;
  onlyClick?: boolean;
  icon?: React.ReactNode;
  productGroups?: ProductGroup[];
}) {
  return (
    <Link href={href} style={{ color: 'white' }}>
      <a>
        <Popover
          destroyTooltipOnHide
          autoAdjustOverflow
          overlayInnerStyle={{
            width: 1200,
            overflow: 'auto',
          }}
          content={
            <PrimaryHeaderMenuList
              productGroups={productGroups || []}
              parentHref={href}
            />
          }
          showArrow={false}
          arrowContent={null}
          trigger="hover"
          placement="bottomLeft"
        >
          <Space align="center">
            {icon}
            <Typography.Text className="whitespace-nowrap font-medium uppercase text-white">
              {label}
            </Typography.Text>
            {!onlyClick && (
              <ChevronDown className="-ml-1 text-white" size={16} />
            )}
          </Space>
        </Popover>
      </a>
    </Link>
  );
}

export default PrimaryHeaderMenuItem;
