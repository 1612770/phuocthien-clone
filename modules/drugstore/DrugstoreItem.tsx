import { List, Typography } from 'antd';
import Link from 'next/link';
import React from 'react';
import DrugStore from '@configs/models/drug-store.model';
import ImageWithFallback from '@components/templates/ImageWithFallback';
import ImageUtils from '@libs/utils/image.utils';

function DrugstoreItem({
  drugstore,
  variant = 'list-item',
  quantity,
}: {
  drugstore: DrugStore;
  variant?: 'list-item' | 'card';
  quantity?: number;
}) {
  return (
    <Link href={`/nha-thuoc/${drugstore.key}`}>
      <a>
        {variant === 'list-item' && (
          <List.Item className="py-3 px-4 transition duration-200 ease-in-out hover:bg-gray-100">
            <div className="flex items-start">
              <div className="min-w-[40px]">
                <ImageWithFallback
                  src={drugstore.image || ''}
                  width={40}
                  height={40}
                  layout="fixed"
                  objectFit="contain"
                  getMockImage={() => ImageUtils.getRandomMockDrugstoreUrl()}
                />
              </div>
              <div className="ml-2">
                <Typography className=" text-xs font-semibold">
                  {drugstore.name}
                </Typography>
                <Typography className="text-sm font-medium text-gray-600">
                  {drugstore.address}
                </Typography>

                {!!quantity && (
                  <Typography className="text-sm text-primary">
                    Có sẵn <b className="text-inherit">{quantity}</b> sản phẩm
                  </Typography>
                )}

                <Typography className="text-xs text-gray-600">
                  {drugstore.tel}
                </Typography>
              </div>
            </div>
          </List.Item>
        )}

        {variant === 'card' && (
          <div className="h-full rounded-lg border border-solid border-gray-200 bg-white p-4 transition duration-200 ease-in-out hover:border-primary-light hover:bg-gray-100">
            <div className="flex items-start">
              <ImageWithFallback
                src={drugstore.image || ''}
                width={32}
                height={32}
                layout="fixed"
                objectFit="contain"
                getMockImage={() => ImageUtils.getRandomMockDrugstoreUrl()}
              />
              <div className="ml-2">
                <Typography className="  font-medium">
                  {drugstore.name}
                </Typography>
                <a href={`tel:${drugstore.tel}`}>
                  <Typography className=" text-gray-600">
                    {drugstore.tel}
                  </Typography>
                </a>
                <Typography className=" text-gray-600">
                  {drugstore.address}
                </Typography>
              </div>
            </div>
          </div>
        )}
      </a>
    </Link>
  );
}

export default DrugstoreItem;
