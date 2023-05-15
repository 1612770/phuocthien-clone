import { Popover, Space, Typography } from 'antd';
import Link from 'next/link';
import PrimaryHeaderMenuList from './PrimaryHeaderMenuList';
import ProductGroupModel from '@configs/models/product-group.model';
import { DownOutlined } from '@ant-design/icons';

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
  productGroups?: ProductGroupModel[];
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
          open={false}
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
            <Typography.Text className="whitespace-nowrap font-medium uppercase">
              {label}
            </Typography.Text>
            {!onlyClick && <DownOutlined className="text-stone-800" />}
          </Space>
        </Popover>
      </a>
    </Link>
  );
}

export default PrimaryHeaderMenuItem;
