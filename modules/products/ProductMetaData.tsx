import Product from '@configs/models/product.model';
import { Typography } from 'antd';
import React from 'react';

function ProductMetaData({ product }: { product: Product }) {
  return (
    <div className="mb-2 mt-8">
      {!!product?.productionBrand?.name && (
        <div className="my-2 grid grid-cols-1 md:grid-cols-[120px,_1fr]">
          <Typography.Text className=" font-medium ">
            Thương hiệu
          </Typography.Text>
          <Typography.Text className=" ml-0 md:ml-2">
            {product?.productionBrand?.name}
          </Typography.Text>
        </div>
      )}
      {!!product?.registrationNumber && (
        <div className="my-2 grid grid-cols-1 md:grid-cols-[120px,_1fr]">
          <Typography.Text className=" font-medium ">
            Số đăng ký
          </Typography.Text>
          <Typography.Text className=" ml-0 md:ml-2">
            {product?.registrationNumber}
          </Typography.Text>
        </div>
      )}
      {!!product?.packagingProcess && (
        <div className="my-2 grid grid-cols-1 md:grid-cols-[120px,_1fr]">
          <Typography.Text className=" font-medium ">
            Quy cách đóng gói
          </Typography.Text>
          <Typography.Text className=" ml-0 md:ml-2">
            {product?.packagingProcess}{' '}
            {product?.detail?.packedType
              ? `(${product?.detail?.packedType})`
              : ``}
          </Typography.Text>
        </div>
      )}

      {!!product?.detail?.drugUsers && (
        <div className="my-2 grid grid-cols-1 md:grid-cols-[120px,_1fr]">
          <Typography.Text className=" font-medium ">
            Đối tượng sử dụng
          </Typography.Text>
          <Typography.Text className=" ml-0 md:ml-2">
            {product?.detail?.drugUsers}
          </Typography.Text>
        </div>
      )}
      {!!product?.ingredient && (
        <div className="my-2 grid grid-cols-1 md:grid-cols-[120px,_1fr]">
          <Typography.Text className=" whitespace-nowrap font-medium">
            Hoạt chất
          </Typography.Text>
          <Typography.Text className=" ml-0 md:ml-2">
            {product?.ingredient}
          </Typography.Text>
        </div>
      )}

      {!!product?.drugContent && (
        <div className="my-2 grid grid-cols-1 md:grid-cols-[120px,_1fr]">
          <Typography.Text className=" font-medium ">Hàm lượng</Typography.Text>
          <Typography.Text className=" ml-0 md:ml-2">
            {product?.drugContent}
          </Typography.Text>
        </div>
      )}

      <div className="my-2 grid grid-cols-1 md:grid-cols-[120px,_1fr]">
        <Typography.Text className=" font-medium ">
          Là thuốc kê đơn
        </Typography.Text>
        <Typography.Text className=" ml-0 md:ml-2">
          {product?.isPrescripted ? 'Có' : 'Không'}
        </Typography.Text>
      </div>

      {product?.isSpecial && (
        <div className="my-2 grid grid-cols-1 md:grid-cols-[120px,_1fr]">
          <Typography.Text className=" font-medium ">
            Là thuốc đặc biệt
          </Typography.Text>
          <Typography.Text className=" ml-0 md:ml-2">
            {product?.isSpecial ? 'Có' : 'Không'}
          </Typography.Text>
        </div>
      )}

      {product?.isMental && (
        <div className="my-2 grid grid-cols-1 md:grid-cols-[120px,_1fr]">
          <Typography.Text className=" font-medium ">
            Là thuốc tâm thần
          </Typography.Text>
          <Typography.Text className=" ml-0 md:ml-2">
            {product?.isMental ? 'Có' : 'Không'}
          </Typography.Text>
        </div>
      )}
    </div>
  );
}

export default ProductMetaData;
