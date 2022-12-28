import { Typography } from 'antd';
import Link from 'next/link';

function ProductGroup() {
  return (
    <Link href="/duoc-my-pham/co-xuong-khop-gut">
      <a>
        <div className="flex w-[120px] flex-col rounded-lg border border-solid border-gray-200 px-2 py-4">
          <img
            src="https://phuocthien.vn//Images/ImageUpload/2020-12/tkkd.png"
            alt="product group image"
            className="m-auto mb-2 aspect-square w-[40px]"
          />
          <Typography className="mb-1 text-center">
            Cơ xương khớp, gút
          </Typography>
          <Typography className="text-center text-xs text-gray-400">
            39 sản phẩm
          </Typography>
        </div>
      </a>
    </Link>
  );
}

export default ProductGroup;
