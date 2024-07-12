import { Collapse, ConfigProvider, Empty, Typography } from 'antd';
import { ChevronDown } from 'react-feather';
import ImageWithFallback from '@components/templates/ImageWithFallback';
import { listMenu } from '@configs/constants/listMenu';
import LinkWrapper from '@components/templates/LinkWrapper';
import { DoubleRightOutlined } from '@ant-design/icons';

export function ProductTypesCollapse() {
  return (
    <ConfigProvider
      theme={{
        components: {
          Collapse: {
            contentPadding: 0,
            headerPadding: '16px 0 0',
          },
        },
      }}
    >
      <Collapse
        rootClassName="px-0"
        accordion
        items={listMenu.map((menu, idx) => ({
          key: idx,
          headerClass: 'px-0',
          className: '',
          label: (
            <div>
              <span className="flex items-center">
                <Typography className="text-base font-medium uppercase text-gray-700">
                  {menu.productTypeName}
                </Typography>
              </span>
            </div>
          ),
          children: (
            <div>
              <LinkWrapper href={`/${menu.productTypeUrl}`}>
                <div className="mb-4 flex cursor-pointer items-center">
                  <DoubleRightOutlined className="italic text-primary" />
                  &nbsp;
                  <Typography className="font-medium italic text-primary underline">
                    Xem tất cả
                  </Typography>
                </div>
              </LinkWrapper>

              {!!menu.productGroups?.length &&
                menu.productGroups?.map((group, idx) => (
                  <LinkWrapper
                    key={idx}
                    href={`/${menu.productTypeUrl}/${group?.productGroupUrl}`}
                  >
                    <div className="my-2 flex cursor-pointer items-center">
                      <ImageWithFallback
                        src={group?.productGroupImage || ''}
                        width={32}
                        height={32}
                      />
                      <Typography className="ml-2">
                        {group?.productGroupName}
                      </Typography>
                    </div>
                  </LinkWrapper>
                ))}

              {!menu.productGroups?.length && (
                <Empty
                  description={<Typography>Không có danh mục nào</Typography>}
                />
              )}
            </div>
          ),
        }))}
        bordered={false}
        ghost
        expandIconPosition="end"
        expandIcon={({ isActive }) => (
          <ChevronDown size={16} className={isActive ? 'rotate-180' : ''} />
        )}
      />
    </ConfigProvider>
  );
}
