import { Popover, Space, Typography } from 'antd';
import { ChevronDown } from 'react-feather';
import PrimaryHeaderMenuAllPopoverContent from './PrimaryHeaderMenuAllPopoverContent';

function PrimaryHeaderMenuAll() {
  return (
    <Popover
      destroyTooltipOnHide
      autoAdjustOverflow
      overlayInnerStyle={{
        overflow: 'auto',
        width: '1200px',
      }}
      content={<PrimaryHeaderMenuAllPopoverContent />}
      placement="bottomLeft"
      showArrow={false}
      arrowContent={null}
      trigger="hover"
    >
      <Space align="center" className="cursor-pointer">
        <Typography.Text className="whitespace-nowrap font-medium uppercase text-white">
          Tất cả danh mục
        </Typography.Text>
        <ChevronDown className="-ml-1 text-white" size={16} />
      </Space>
    </Popover>
  );
}

export default PrimaryHeaderMenuAll;
