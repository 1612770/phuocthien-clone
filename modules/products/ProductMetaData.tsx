import Product from '@configs/models/product.model';
import { Typography } from 'antd';
import React from 'react';
import QRApp from './QRApp';

function ProductMetaData({ product }: { product: Product }) {
  return (
    <div className="r mb-0 mt-6 lg:mb-4 lg:mt-12">
      {!!product?.detail?.useOfDrugs && (
        <div className="my-2 mb-4 grid grid-cols-1 md:grid-cols-[minmax(120px,140px),_1fr]">
          <Typography.Text className="font-bold">Công dụng</Typography.Text>
          <Typography.Text className=" ml-0 md:ml-2">
            {product?.detail?.useOfDrugs}
          </Typography.Text>
        </div>
      )}
      {!!product?.detail?.drugUsers && (
        <div className="my-2 mb-4 grid grid-cols-1 md:grid-cols-[minmax(120px,140px),_1fr]">
          <Typography.Text className=" font-bold">
            Đối tượng sử dụng
          </Typography.Text>
          <Typography.Text className=" ml-0 md:ml-2">
            {product?.detail?.drugUsers}
          </Typography.Text>
        </div>
      )}

      {!!product?.ingredient && (
        <div className="my-2 mb-4 grid grid-cols-1 md:grid-cols-[minmax(120px,140px),_1fr]">
          <Typography.Text className=" whitespace-nowrap  font-bold  ">
            Hoạt chất
          </Typography.Text>
          <Typography.Text className=" ml-0 md:ml-2">
            {product?.ingredient}
          </Typography.Text>
        </div>
      )}
      {!!product?.productionBrand?.name && (
        <div className="my-2 mb-4 grid grid-cols-1 md:grid-cols-[minmax(120px,140px),_1fr]">
          <Typography.Text className=" font-bold">Thương hiệu</Typography.Text>
          <Typography.Text className=" ml-0 md:ml-2">
            {product?.productionBrand?.name}
          </Typography.Text>
        </div>
      )}
      {!!product?.registrationNumber && (
        <div className="my-2 mb-4 grid grid-cols-1 md:grid-cols-[minmax(120px,140px),_1fr]">
          <Typography.Text className=" font-bold">Số đăng ký</Typography.Text>
          <Typography.Text className=" ml-0 md:ml-2">
            {product?.registrationNumber}
          </Typography.Text>
        </div>
      )}
      {!!product?.packagingProcess && (
        <div className="my-2 mb-4 grid grid-cols-1 md:grid-cols-[minmax(120px,140px),_1fr]">
          <Typography.Text className=" font-bold">
            Cách đóng gói
          </Typography.Text>
          <Typography.Text className=" ml-0 md:ml-2">
            {product?.packagingProcess}{' '}
          </Typography.Text>
        </div>
      )}
      {!!product?.detail?.packedType && (
        <div className="my-2 mb-4 grid grid-cols-1 md:grid-cols-[minmax(120px,140px),_1fr]">
          <Typography.Text className=" font-bold">Dạng bào chế</Typography.Text>
          <Typography.Text className=" ml-0 md:ml-2">
            {product?.detail?.packedType}
          </Typography.Text>
        </div>
      )}

      {!!product?.drugContent && (
        <div className="my-2 mb-4 grid grid-cols-1 md:grid-cols-[minmax(120px,140px),_1fr]">
          <Typography.Text className=" font-bold">Hàm lượng</Typography.Text>
          <Typography.Text className=" ml-0 md:ml-2">
            {product?.drugContent}
          </Typography.Text>
        </div>
      )}

      <div className="my-2 mb-4 grid grid-cols-1 md:grid-cols-[minmax(120px,140px),_1fr]">
        <Typography.Text className=" font-bold">
          Là thuốc kê đơn
        </Typography.Text>
        <Typography.Text className=" ml-0 md:ml-2">
          {product?.isPrescripted ? 'Có' : 'Không'}
        </Typography.Text>
      </div>

      {product?.isSpecial && (
        <div className="my-2 mb-4 grid grid-cols-1 md:grid-cols-[minmax(120px,140px),_1fr]">
          <Typography.Text className=" font-bold">
            Là thuốc đặc biệt
          </Typography.Text>
          <Typography.Text className=" ml-0 md:ml-2">
            {product?.isSpecial ? 'Có' : 'Không'}
          </Typography.Text>
        </div>
      )}

      {product?.isMental && (
        <div className="my-2 mb-4 grid grid-cols-1 md:grid-cols-[minmax(120px,140px),_1fr]">
          <Typography.Text className=" font-bold">
            Là thuốc tâm thần
          </Typography.Text>
          <Typography.Text className=" ml-0 md:ml-2">
            {product?.isMental ? 'Có' : 'Không'}
          </Typography.Text>
        </div>
      )}
      <QRApp />
    </div>
  );
}

export default ProductMetaData;
