import { List, Popover, Space, Typography } from 'antd';
import Link from 'next/link';
import { ChevronDown } from 'react-feather';

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
        content={
          <List
            size="small"
            itemLayout="horizontal"
            dataSource={['Cơ xương khớp, gút', 'Da liễu, dị ứng']}
            header={
              <List.Item className="py-1">
                <Link href="/">
                  <a>
                    <Typography.Text className="font-medium uppercase text-primary">
                      Xem tất cả thuốc
                    </Typography.Text>
                  </a>
                </Link>
              </List.Item>
            }
            renderItem={(item) => (
              <List.Item className="min-w-32">
                <Link href="/">
                  <a>
                    <Typography.Text>{item}</Typography.Text>
                  </a>
                </Link>
              </List.Item>
            )}
          />
        }
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
