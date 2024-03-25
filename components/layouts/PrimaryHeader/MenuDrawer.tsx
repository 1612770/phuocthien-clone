import {
  Button,
  Collapse,
  Divider,
  Drawer,
  DrawerProps,
  Empty,
  Space,
  Typography,
} from 'antd';
import { Book, ChevronDown, LogOut, User, X } from 'react-feather';
import IMAGES from '@configs/assests/images';
import Link from 'next/link';
import { useFullMenu } from '@providers/FullMenuProvider';
import ImageWithFallback from '@components/templates/ImageWithFallback';
import { useAuth } from '@providers/AuthProvider';

function PrimaryHeaderMenuDrawer({ open, onClose }: DrawerProps) {
  const { fullMenu } = useFullMenu();
  const { logOut, isUserLoggedIn } = useAuth();

  return (
    <Drawer
      rootClassName=""
      title={
        <div>
          <Link href="/" style={{ color: 'white' }}>
            <img
              src={IMAGES.logo}
              alt="Nhà thuốc Phước Thiện"
              className="mr-2 h-8 object-contain"
            />
          </Link>
        </div>
      }
      placement="left"
      onClose={onClose}
      open={open}
      closable
      closeIcon={<X size={40} className="mr-0 text-primary" />}
    >
      <Space size={16} direction="vertical" className="w-full">
        <Link href={'/lich-su-don-hang'}>
          <a>
            <Button
              onClick={onClose}
              type="primary"
              className="h-10 w-full bg-white shadow-none"
            >
              <Space align="center" className="h-full w-full">
                <User className="text-primary" width={20} height={20} />
                <Typography.Text className="text-primary">
                  Lịch sử đơn hàng
                </Typography.Text>
              </Space>
            </Button>
          </a>
        </Link>

        {isUserLoggedIn && (
          <Link href="/thong-tin-ca-nhan">
            <Button
              onClick={onClose}
              type="primary"
              className="h-10 w-full bg-primary-dark shadow-none"
            >
              <div className="flex items-center gap-2">
                <Space align="center" className="h-full w-full">
                  <Book className="text-white" width={20} height={20} />
                  <Typography.Text className="text-white">
                    Thông tin cá nhân
                  </Typography.Text>
                </Space>
              </div>
            </Button>
          </Link>
        )}

        {isUserLoggedIn && (
          <Button
            onClick={logOut}
            ghost
            type="primary"
            className="h-10 w-full shadow-none"
          >
            <div className="flex items-center gap-2">
              <Space align="center" className="h-full w-full">
                <LogOut className="" width={20} height={20} />
                <Typography.Text className="text-primary">
                  Đăng xuất
                </Typography.Text>
              </Space>
            </div>
          </Button>
        )}
      </Space>
      <Divider className="mt-4 mb-0" />
      <Collapse
        accordion
        bordered={false}
        ghost
        expandIconPosition="end"
        expandIcon={({ isActive }) => (
          <ChevronDown size={16} className={isActive ? 'rotate-180' : ''} />
        )}
      >
        {fullMenu.map((menu, idx) => (
          <Collapse.Panel
            header={
              <span className=" flex items-center">
                <Typography className=" text-base font-medium uppercase text-gray-700">
                  {menu.name}
                </Typography>
              </span>
            }
            key={idx}
          >
            <div
              className="-mt-6"
              onClick={(e) => {
                onClose?.(e);
              }}
            >
              <Link href={`/${menu.seoUrl}`}>
                <a className="my-2 -mx-4 flex items-center">
                  <ImageWithFallback
                    src={menu?.image || ''}
                    width={32}
                    height={32}
                  />
                  <Typography className="ml-2 font-medium">
                    Tất cả {menu?.name}
                  </Typography>
                </a>
              </Link>

              {!!menu.productGroups?.length &&
                menu.productGroups?.map((group, idx) => (
                  <Link key={idx} href={`/${menu.seoUrl}/${group?.seoUrl}`}>
                    <a className="my-2 -mx-4 flex items-center">
                      <ImageWithFallback
                        src={group?.image || ''}
                        width={32}
                        height={32}
                      />
                      <Typography className="ml-2">{group?.name}</Typography>
                    </a>
                  </Link>
                ))}

              {!menu.productGroups?.length && (
                <Empty
                  description={<Typography>Không có danh mục nào</Typography>}
                ></Empty>
              )}
            </div>
          </Collapse.Panel>
        ))}
      </Collapse>
      <Divider className="mt-4 mb-0" />
      <Space size={8} direction="vertical" className="mt-4 w-full">
        <Link href={`/goc-suc-khoe`}>
          <a className="my-2 -mx-2 flex items-center">
            <Typography
              onClick={(e) => {
                onClose?.(e);
              }}
              className="ml-2 font-medium"
            >
              GÓC SỨC KHỎE
            </Typography>
          </a>
        </Link>

        <Link href={`/nha-thuoc`}>
          <a className="my-2 -mx-2 flex items-center">
            <Typography
              onClick={(e) => {
                onClose?.(e);
              }}
              className="ml-2 font-medium"
            >
              CHUỖI NHÀ THUỐC
            </Typography>
          </a>
        </Link>
      </Space>
    </Drawer>
  );
}

export default PrimaryHeaderMenuDrawer;
