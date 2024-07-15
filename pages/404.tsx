import { Button, Result } from 'antd';
import Link from 'next/link';
import React from 'react';

function NotFound() {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Trang bạn tìm kiếm không tồn tại."
      extra={
        <Link href="/" passHref>
          <Button type="primary">Quay về trang chủ</Button>
        </Link>
      }
    />
  );
}

export default NotFound;
