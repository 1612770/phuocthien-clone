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
import { useFullMenu } from '@providers/FullMenuProvider';
import ImageWithFallback from '@components/templates/ImageWithFallback';
import { useAuth } from '@providers/AuthProvider';
import { useRouter } from 'next/router';

function PrimaryHeaderMenuDrawer({ open, onClose }: DrawerProps) {
  const { fullMenu } = useFullMenu();
  const { logOut, isUserLoggedIn } = useAuth();
  const router = useRouter();
  return (
    <Drawer
      rootClassName=""
      title={
        <div
          className="cursor-pointer"
          onClick={() => {
            router.push('/');
          }}
        >
          <img
            src={IMAGES.logo}
            alt="Nhà thuốc Phước Thiện"
            className="mr-2 h-8 object-contain"
          />
        </div>
      }
      placement="left"
      onClose={onClose}
      open={open}
      closable
      closeIcon={<X size={40} className="mr-0 text-primary" />}
    >
      <Space size={16} direction="vertical" className="w-full">
        <div
          className="cursor-pointer"
          onClick={() => router.push('/lich-su-don-hang')}
        >
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
        </div>

        {isUserLoggedIn && (
          <div
            className="cursor-pointer"
            onClick={() => router.push('/thong-tin-ca-nhan')}
          >
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
          </div>
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
              <div
                onClick={() => router.push(`/${menu.seoUrl}`)}
                className="my-2 -mx-4 flex cursor-pointer items-center"
              >
                <ImageWithFallback
                  src={menu?.image || ''}
                  width={32}
                  height={32}
                />
                <Typography className="ml-2 font-medium">
                  Tất cả {menu?.name}
                </Typography>
              </div>

              {!!menu.productGroups?.length &&
                menu.productGroups?.map((group, idx) => (
                  <div
                    key={idx}
                    onClick={() =>
                      router.push(`/${menu.seoUrl}/${group?.seoUrl}`)
                    }
                    className="my-2 -mx-4 flex cursor-pointer items-center"
                  >
                    <ImageWithFallback
                      src={group?.image || ''}
                      width={32}
                      height={32}
                    />
                    <Typography className="ml-2">{group?.name}</Typography>
                  </div>
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
        <div
          onClick={() => router.push(`/bai-viet`)}
          className="my-2 -mx-2 flex cursor-pointer items-center"
        >
          <Typography
            onClick={(e) => {
              onClose?.(e);
            }}
            className="ml-2 font-medium"
          >
            GÓC SỨC KHỎE
          </Typography>
        </div>

        <div
          onClick={() => router.push(`/nha-thuoc`)}
          className="my-2 -mx-2 flex cursor-pointer items-center"
        >
          <Typography
            onClick={(e) => {
              onClose?.(e);
            }}
            className="ml-2 font-medium"
          >
            CHUỖI NHÀ THUỐC
          </Typography>
        </div>
      </Space>
    </Drawer>
  );
}

export default PrimaryHeaderMenuDrawer;
