import { CheckCircleOutlined } from '@ant-design/icons';
import { Button, Card, Typography } from 'antd';
import Link from 'next/link';
import React from 'react';

function PrescriptionSuccessView({ onReset }: { onReset: () => void }) {
  return (
    <div className="container flex h-screen items-center justify-center">
      <div className="text-center">
        <Card
          actions={[
            <div
              key="actions"
              className="flex items-center justify-center gap-4"
            >
              <Link href={'/'}>
                <Button ghost type="primary">
                  Tiếp tục mua hàng
                </Button>
              </Link>
              <Button type="primary" onClick={onReset}>
                Gửi toa thuốc khác
              </Button>
            </div>,
          ]}
        >
          <CheckCircleOutlined
            style={{ fontSize: '60px', margin: '16px' }}
            className="text-green-600"
          />
          <Typography.Title level={5} className="mb-2 text-green-600">
            Nhà thuốc đã nhận được thông tin của bạn
          </Typography.Title>
          <Typography.Text className="text-slate-600">
            Đội ngũ dược sĩ chuyên môn của hệ thống nhà thuốc sẽ gọi lại để xác
            nhận thông tin và tư vấn thuốc cho quý khách hàng trong thời gian
            sớm nhất
          </Typography.Text>
        </Card>
      </div>
    </div>
  );
}

export default PrescriptionSuccessView;
