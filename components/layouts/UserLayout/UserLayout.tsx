import { Avatar, List, Typography } from 'antd';
import { User, Book, LogOut } from 'react-feather';
import { useAuth } from '@providers/AuthProvider';
import { useRouter } from 'next/router';
import Link from 'next/link';

export interface IUserLayout {
  children: React.ReactNode;
}

const UserLayout: React.FC<IUserLayout> = ({ children }) => {
  const { logOut } = useAuth();
  const router = useRouter();

  const isActiveOrderList = router.asPath.startsWith('/lich-su-don-hang');
  const isProfile = router.asPath.startsWith('/thong-tin-ca-nhan');

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[240px_1fr]">
      <List className="-mt-2 hidden lg:block">
        <Link href="/lich-su-don-hang">
          <a>
            <List.Item className="border-none p-0">
              <div
                className={`${
                  isActiveOrderList ? 'border-primary' : 'border-transparent'
                } my-1 flex w-full cursor-pointer items-center gap-2 rounded-full border border-solid px-4 py-2 transition-all duration-200 ease-in-out hover:border-gray-300`}
              >
                <Avatar className={`${isActiveOrderList ? 'bg-primary' : ''}`}>
                  <User className=" align-text-bottom" size={16} />
                </Avatar>
                <Typography
                  className={`${isActiveOrderList ? 'text-primary' : ''}`}
                >
                  Lịch sử đơn hàng
                </Typography>
              </div>
            </List.Item>
          </a>
        </Link>

        <div
          onClick={() => router.push('/thong-tin-ca-nhan')}
          className="cursor-pointer"
        >
          <List.Item className="border-none p-0">
            <div
              className={`${
                isProfile ? 'border-primary' : ' border-transparent'
              } my-1 flex w-full cursor-pointer items-center gap-2 rounded-full border border-solid px-4 py-2 transition-all duration-200 ease-in-out`}
            >
              <Avatar className={`${isProfile ? 'bg-primary' : ''}`}>
                <Book className=" align-text-bottom" size={16} />
              </Avatar>
              <Typography className={`${isProfile ? 'text-primary' : ''}`}>
                Thông tin cá nhân
              </Typography>
            </div>
          </List.Item>
        </div>
        <List.Item
          className="border-none p-0"
          onClick={() => {
            logOut();
          }}
        >
          <div
            className={`my-1 flex w-full cursor-pointer items-center gap-2 rounded-full px-4 py-2 transition-all duration-200 ease-in-out`}
          >
            <Avatar className=" bg-red-500">
              <LogOut className=" align-text-bottom" size={16} />
            </Avatar>
            <Typography className="">Đăng xuất</Typography>
          </div>
        </List.Item>
      </List>
      <div>{children}</div>
    </div>
  );
};

export default UserLayout;
