import {
  Button,
  Collapse,
  Divider,
  Drawer,
  DrawerProps,
  Space,
  Typography,
} from 'antd';
import { ChevronDown, ShoppingCart, User, X } from 'react-feather';
import PrimaryHeaderMenuList from './PrimaryHeaderMenuList';
import IMAGES from '@configs/assests/images';
import Link from 'next/link';

function PrimaryheaderMenuDrawer({ open, onClose }: DrawerProps) {
  return (
    <Drawer
      title={
        <div className="flex flex-1 items-center">
          <Link href="/" style={{ color: 'white' }}>
            <img
              src={IMAGES.logo}
              alt="Nhà thuốc Phước Thiện"
              className="aspect-square h-8 w-16 object-contain"
            />
          </Link>

          <Space direction="vertical" size={0} className="mr-4 w-[92px]">
            <Typography.Text className="m-0 -mb-2 inline-block text-base text-white">
              Nhà thuốc
            </Typography.Text>
            <Typography.Text strong className="uppercase text-white">
              Phước Thiện
            </Typography.Text>
          </Space>
        </div>
      }
      placement="right"
      onClose={onClose}
      open={open}
      closable
      closeIcon={<X size={16} />}
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
