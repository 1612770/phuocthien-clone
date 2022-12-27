import {
  Button,
  Collapse,
  Divider,
  Drawer,
  DrawerProps,
  Space,
  Typography,
} from 'antd';
import { ChevronDown, ShoppingCart, User } from 'react-feather';
import PrimaryHeaderMenuList from './PrimaryHeaderMenuList';

function PrimaryheaderMenuDrawer({ open, onClose }: DrawerProps) {
  return (
    <Drawer
      title=""
      placement="right"
      onClose={onClose}
      open={open}
      closable={false}
    >
      <Space size={16} direction="vertical" className="w-full">
        <Button
          type="primary"
          className="h-10 w-full bg-primary-dark shadow-none"
        >
          <Space align="center" className="h-full w-full">
            <ShoppingCart className="text-white" size={20} />
            <Typography.Text className="text-white">Giỏ hàng</Typography.Text>
          </Space>
        </Button>
        <Button
          type="primary"
          className="h-10 w-full bg-primary-dark shadow-none"
        >
          <Space align="center" className="h-full w-full">
            <User className="text-white" width={20} height={20} />
            <Typography.Text className="text-white">
              Lịch sử đơn hàng
            </Typography.Text>
          </Space>
        </Button>
      </Space>
      <Divider />
      <Collapse
        accordion
        bordered={false}
        ghost
        expandIconPosition="right"
        expandIcon={({ isActive }) => (
          <ChevronDown size={16} className={isActive ? 'rotate-180' : ''} />
        )}
      >
        <Collapse.Panel header="Thuốc" key="1">
          <div className="-mt-6">
            <PrimaryHeaderMenuList />
          </div>
        </Collapse.Panel>
        <Collapse.Panel header="Thực phẩm chức năng" key="Thực phẩm chức năng">
          <div className="-mt-6">
            <PrimaryHeaderMenuList />
          </div>
        </Collapse.Panel>
        <Collapse.Panel
          header="Thiết bị, dụng cụ y tế"
          key="Thiết bị, dụng cụ y tế"
        >
          <div className="-mt-6">
            <PrimaryHeaderMenuList />
          </div>
        </Collapse.Panel>
        <Collapse.Panel header="Mỹ phẩm" key="Mỹ phẩm">
          <div className="-mt-6">
            <PrimaryHeaderMenuList />
          </div>
        </Collapse.Panel>
        <Collapse.Panel header="Chăm sóc cá nhân" key="Chăm sóc cá nhân">
          <div className="-mt-6">
            <PrimaryHeaderMenuList />
          </div>
        </Collapse.Panel>
        <Collapse.Panel header="Chăm sóc trẻ em" key="Chăm sóc trẻ em">
          <div className="-mt-6">
            <PrimaryHeaderMenuList />
          </div>
        </Collapse.Panel>
      </Collapse>
    </Drawer>
  );
}

export default PrimaryheaderMenuDrawer;
