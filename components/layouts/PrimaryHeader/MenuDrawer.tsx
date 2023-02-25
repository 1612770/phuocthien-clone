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
import UrlUtils from '@libs/utils/url.utils';
import ImageWithFallback from '@components/templates/ImageWithFallback';
import { useAuth } from '@providers/AuthProvider';

function PrimaryHeaderMenuDrawer({ open, onClose }: DrawerProps) {
  const { fullMenu } = useFullMenu();
  const { logOut, isUserLoggedIn } = useAuth();

  return (
    <Drawer
      rootClassName="primary-header-menu-drawer"
      title={
        <Link href="/" style={{ color: 'white' }}>
          <a className="flex items-center" onClick={onClose}>
            <img
              src={IMAGES.logo}
              alt="Nhà thuốc Phước Thiện"
              className="mr-2 h-8 object-contain"
            />

            <Space direction="vertical" size={0} className="mr-4 w-[92px]">
              <Typography.Text className="m-0 -mb-2 inline-block text-base font-normal text-white">
                Nhà thuốc
              </Typography.Text>
              <Typography.Text strong className="uppercase text-white">
                Phước Thiện
              </Typography.Text>
            </Space>
          </a>
        </Link>
      }
      placement="left"
      onClose={onClose}
      open={open}
      closable
      closeIcon={<X size={40} className="mr-0 text-white" />}
    >
      <Space size={16} direction="vertical" className="w-full">
        <Link href={'/lich-su-don-hang'}>
          <a>
            <Button
              onClick={onClose}
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
              <Link href={`/${UrlUtils.generateSlug(menu?.name, menu?.key)}`}>
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
                  <Link
                    key={idx}
                    href={`/${UrlUtils.generateSlug(
                      menu?.name,
                      menu?.key
                    )}/${UrlUtils.generateSlug(group?.name, group?.key)}`}
                  >
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
    </Drawer>
  );
}

export default PrimaryHeaderMenuDrawer;
