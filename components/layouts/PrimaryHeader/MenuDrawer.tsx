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
import ImageWithFallback from '@components/templates/ImageWithFallback';
import { useAuth } from '@providers/AuthProvider';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { listMenu } from '@configs/constants/listMenu';

function PrimaryHeaderMenuDrawer({ open, onClose }: DrawerProps) {
  // const { fullMenu } = useFullMenu();
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
        <Link href={'/lich-su-don-hang'} passHref>
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
          <Link href={'/thong-tin-ca-nhan'} passHref>
            <a>
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
            </a>
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
        {listMenu.map((menu, idx) => (
          <Collapse.Panel
            header={
              <span className=" flex items-center">
                <Typography className=" text-base font-medium uppercase text-gray-700">
                  {menu.productTypeName}
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
              <Link href={`/${menu.productTypeUrl}`} passHref>
                <a>
                  <div className="my-2 -mx-4 flex cursor-pointer items-center">
                    {/* <ImageWithFallback
                      src={menu?.image || ''}
                      width={32}
                      height={32}
                    /> */}
                    <Typography className="ml-2 font-medium">
                      Xem tất cả
                    </Typography>
                  </div>
                </a>
              </Link>

              {!!menu.productGroups?.length &&
                menu.productGroups?.map((group, idx) => (
                  <Link
                    key={idx}
                    href={`/${menu.productTypeUrl}/${group?.productGroupUrl}`}
                  >
                    <a>
                      <div className="my-2 -mx-4 flex cursor-pointer items-center">
                        <ImageWithFallback
                          src={group?.productGroupImage || ''}
                          width={32}
                          height={32}
                        />
                        <Typography className="ml-2">
                          {group?.productGroupName}
                        </Typography>
                      </div>
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
