import { Popover, Space, Typography } from 'antd';
import Link from 'next/link';
import { ChevronDown } from 'react-feather';
import PrimaryHeaderMenuList from './PrimaryHeaderMenuList';

function PrimaryHeaderMenuItem({
  label,
  icon,
  onlyClick,
}: {
  label: string;
  onlyClick?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <Link href="/" style={{ color: 'white' }}>
      <Popover
        placement="bottomLeft"
        content={<PrimaryHeaderMenuList />}
        trigger="hover"
      >
        <a>
          <Space align="center">
            {icon}
            <Typography.Text className="font-medium uppercase text-white">
              {label}
            </Typography.Text>
            {!onlyClick && (
              <ChevronDown className="-ml-1 text-white" size={16} />
            )}
          </Space>
        </a>
      </Popover>
    </Link>
  );
}

export default PrimaryHeaderMenuItem;
