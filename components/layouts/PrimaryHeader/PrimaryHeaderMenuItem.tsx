import { Popover, Space, Typography } from 'antd';
import PrimaryHeaderMenuList from './PrimaryHeaderMenuList';
import ProductGroupModel from '@configs/models/product-group.model';
import { CaretDownOutlined } from '@ant-design/icons';
import Link from 'next/link';

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
    <Link href={href} passHref>
      <a>
        <div style={{ color: 'white' }}>
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
              <Typography.Text className="whitespace-nowrap font-medium text-white">
                {label}
              </Typography.Text>
              {!onlyClick && (
                <CaretDownOutlined className="text-white" size={8} />
              )}
            </Space>
          </Popover>
        </div>
      </a>
    </Link>
  );
}

export default PrimaryHeaderMenuItem;
