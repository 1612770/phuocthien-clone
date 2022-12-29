import { List, Typography } from 'antd';
import Link from 'next/link';

function PrimaryHeaderMenuList() {
  return (
    <List
      size="small"
      itemLayout="horizontal"
      dataSource={['Cơ xương khớp, gút', 'Da liễu, dị ứng']}
      header={
        <List.Item className="py-1">
          <Link href="/duoc-my-pham">
            <a>
              <Typography.Text className="font-medium uppercase text-primary">
                Xem tất cả dược, mỹ phẩm
              </Typography.Text>
            </a>
          </Link>
        </List.Item>
      }
      renderItem={(item) => (
        <List.Item className="min-w-32">
          <Link href="/duoc-my-pham/co-xuong-khop-gut">
            <a>
              <Typography.Text>{item}</Typography.Text>
            </a>
          </Link>
        </List.Item>
      )}
    />
  );
}

export default PrimaryHeaderMenuList;
