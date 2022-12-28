import { Avatar, Typography } from 'antd';
import Link from 'next/link';

function ProductChildGroup() {
  return (
    <Link href="/duoc-my-pham/co-xuong-khop-gut/tri-benh-xuong-khop">
      <a>
        <div className="group flex cursor-pointer items-center rounded-full border border-solid border-gray-200 p-1 hover:border-primary-light">
          <Avatar
            className="mr-2 border border-solid border-gray-200 group-hover:border-primary-light"
            src="https://cdn.tgdd.vn/Category/10023/10023-120x120.png"
            size={40}
          ></Avatar>
          <Typography className="mr-2">Trị bệnh xương khớp</Typography>
        </div>
      </a>
    </Link>
  );
}

export default ProductChildGroup;
