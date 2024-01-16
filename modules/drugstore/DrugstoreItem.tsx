import { List, Typography } from 'antd';
import Link from 'next/link';
import React from 'react';
import DrugStore from '@configs/models/drug-store.model';
import ImageWithFallback from '@components/templates/ImageWithFallback';
import ImageUtils from '@libs/utils/image.utils';
import { EnvironmentTwoTone } from '@ant-design/icons';
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
          <List.Item className="py-3 px-3 transition duration-200 ease-in-out hover:bg-gray-100">
            <div className="flex items-start">
              <div className="min-w-[40px]">
                <ImageWithFallback
                  src={drugstore.image || ''}
                  width={72}
                  height={72}
                  layout="fixed"
                  objectFit="contain"
                  getMockImage={() => ImageUtils.getRandomMockDrugstoreUrl()}
                />
              </div>
              <div className="ml-2">
                <Typography className="text-sm font-medium text-gray-600">
                  {drugstore.address}
                </Typography>

                {quantity && quantity > 0 ? (
                  <Typography className="text-sm font-bold text-primary">
                    Còn hàng
                  </Typography>
                ) : (
                  <Typography className="text-sm font-bold text-red-600">
                    Hết hàng
                  </Typography>
                )}

                <Typography className="text-sm text-gray-600">
                  {drugstore.tel}
                </Typography>
              </div>
            </div>
          </List.Item>
        )}

        {variant === 'card' && (
          <div className="h-full rounded-lg border border-solid border-gray-200 bg-white p-4 transition duration-200 ease-in-out hover:border-primary-light ">
            <div className="flex items-center justify-between">
              <ImageWithFallback
                src={drugstore.image || ''}
                width={48}
                height={48}
                layout="fixed"
                objectFit="contain"
                getMockImage={() => ImageUtils.getRandomMockDrugstoreUrl()}
              />
              <div className="ml-2">
                <Typography className="text-sm">{drugstore.name}</Typography>
                <Typography className="mt-2 text-xs">
                  {drugstore.address}
                </Typography>
                <a href={`tel:${drugstore.tel}`}>
                  <Typography className=" mt-2 text-xs text-gray-600">
                    {drugstore.tel}
                  </Typography>
                </a>
              </div>
              <div
                className="ml-2 w-[64px] text-center "
                onClick={(e) => {
                  e.preventDefault();
                  e.nativeEvent.stopPropagation();
                  if (drugstore.mapUrl) {
                    window.open(drugstore.mapUrl, '_blank');
                  }
                }}
              >
                <EnvironmentTwoTone width={24} height={24} />
                <Typography className="text-[12px] hover:text-primary">
                  Bản đồ
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
