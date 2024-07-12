import { Steps, Typography } from 'antd';
import React from 'react';

function PrescriptionGuidelinesSteps() {
  return (
    <Steps
      direction="vertical"
      progressDot
      current={3}
      size="small"
      items={[
        {
          title: (
            <Typography.Text className="font-semibold">
              Gửi thông tin
            </Typography.Text>
          ),
          description: (
            <Typography.Text className="text-slate-700">
              Quý khách hàng vui lòng điền thông tin liên hệ và đính kèm hình
              ảnh toa thuốc hoặc sản phẩm cần tư vấn (nếu có)
            </Typography.Text>
          ),
        },
        {
          title: (
            <Typography.Text className="font-semibold">
              Nhận hỗ trợ
            </Typography.Text>
          ),
          description: (
            <Typography.Text className="text-slate-700">
              Đội ngũ dược sĩ chuyên môn của hệ thống nhà thuốc sẽ gọi lại để
              xác nhận thông tin và tư vấn thuốc cho quý khách hàng
            </Typography.Text>
          ),
        },
        {
          title: (
            <Typography.Text className="font-semibold">
              Mua hàng trực tiếp
            </Typography.Text>
          ),
          description: (
            <Typography.Text className="text-slate-700">
              Quý khách hàng nhận được thông tin tư vấn có thể đến nhận thuốc
              tại nhà thuốc gần nhất để được hỗ trợ mua hàng trực tiếp
            </Typography.Text>
          ),
        },
      ]}
    />
  );
}

export default PrescriptionGuidelinesSteps;
