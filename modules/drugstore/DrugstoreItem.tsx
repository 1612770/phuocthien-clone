import { List, Typography } from 'antd';
import Link from 'next/link';
import React from 'react';
import DrugStore from '@configs/models/drug-store.model';
import ImageWithFallback from '@components/templates/ImageWithFallback';
import ImageUtils from '@libs/utils/image.utils';

function DrugstoreItem({
  drugstore,
  variant = 'list-item',
}: {
  drugstore: DrugStore;
  variant?: 'list-item' | 'card';
}) {
  return (
    <Link href={`/nha-thuoc/${drugstore.key}`}>
      <a>
        {variant === 'list-item' && (
          <List.Item className="py-4 px-4 hover:bg-gray-100">
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
                <Typography className=" text-xs font-medium">
                  {drugstore.name}
                </Typography>

                <Typography className="text-xs text-gray-600">
                  {drugstore.tel}
                </Typography>

                <Typography className="text-xs text-gray-600">
                  {drugstore.address}
                </Typography>
              </div>
            </div>
          </List.Item>
        )}

        {variant === 'card' && (
          <div className="h-full rounded-lg border border-solid border-gray-200 bg-white p-4 transition ease-in-out hover:border-primary-light hover:bg-gray-100">
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
