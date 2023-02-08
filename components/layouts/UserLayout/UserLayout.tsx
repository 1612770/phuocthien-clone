import { Avatar, List, Typography } from 'antd';
import { User, Book, LogOut } from 'react-feather';
import { useAuth } from '@providers/AuthProvider';
import Link from 'next/link';
import { useRouter } from 'next/router';

export interface IUserLayout {
  children: React.ReactNode;
}

const UserLayout: React.FC<IUserLayout> = ({ children }) => {
  const { logOut } = useAuth();
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[240px_1fr]">
      <List className="-mt-2 hidden lg:block">
        <Link href="/lich-su-don-hang">
          <List.Item
            className={`${
              router.asPath.startsWith('/lich-su-don-hang') ? 'bg-gray-200' : ''
            } my-2 cursor-pointer rounded-full border-none px-4 transition-all duration-200 ease-in-out hover:bg-gray-200`}
          >
            <div className="flex items-center gap-2">
              <Avatar>
                <User className=" align-text-bottom" size={16} />
              </Avatar>
              <Typography className="">Lịch sử đơn hàng</Typography>
            </div>
          </List.Item>
        </Link>
        <Link href="/thong-tin-ca-nhan">
          <List.Item
            className={`${
              router.asPath.startsWith('/thong-tin-ca-nhan')
                ? 'bg-gray-200'
                : ''
            } my-2 cursor-pointer rounded-full border-none px-4 transition-all duration-200 ease-in-out hover:bg-gray-200`}
          >
            <div className="flex items-center gap-2">
              <Avatar>
                <Book className=" align-text-bottom" size={16} />
              </Avatar>
              <Typography className="">Thông tin cá nhân</Typography>
            </div>
          </List.Item>
        </Link>
        <List.Item
          className={`my-2 cursor-pointer rounded-full border-none px-4 transition-all duration-200 ease-in-out hover:bg-gray-200`}
          onClick={() => {
            logOut();
          }}
        >
          <div className="flex items-center gap-2">
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
