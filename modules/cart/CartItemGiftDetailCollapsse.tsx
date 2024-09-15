import ImageWithFallback from '@components/templates/ImageWithFallback';
import { CartGift } from '@configs/models/product.model';
import { getProductName } from '@libs/helpers';
import CurrencyUtils from '@libs/utils/currency.utils';
import useProductAutoLoadByIds from '@libs/utils/hooks/useProductAutoLoadByIds';
import { Collapse as AntdCollapse, Typography } from 'antd';
import Link from 'next/link';
import styled from 'styled-components';

const Collapse = styled(AntdCollapse)`
  .ant-collapse-item .ant-collapse-header {
    padding: 0;
    padding-bottom: 4px;
  }
`;

function CartItemGiftDetailCollapsse({ cartGift }: { cartGift: CartGift }) {
  const productIds = [
    ...(cartGift.giftPromotion.policies?.map((p) => p.prodId) || []),
    ...(cartGift.giftPromotion.gifts?.map((p) => p.prodId) || []),
  ];
  const { products } = useProductAutoLoadByIds(productIds);

  return (
    <Collapse
      defaultActiveKey={['1']}
      ghost
      className="product-cart-item-collapse mt-1"
    >
      <Collapse.Panel
        showArrow={false}
        header={
          <span className="mb-[-32px] inline-block rounded-lg border border-solid px-2 py-0 text-blue-500">
            <Typography.Text className="text-xs text-inherit">
              Gói quà tặng
            </Typography.Text>
          </span>
        }
        key="1"
        className="p-0"
      >
        <div>
          <ul className="m-0 p-0 py-0 pl-0">
            {cartGift.giftPromotion.policies?.map((policy) => {
              const product = products.find((p) => p.key === policy.prodId);
              return (
                <li key={product?.key} className="my-1 flex">
                  <Link
                    href={`/${product?.productType?.seoUrl}/${product?.detail?.seoUrl}`}
                    passHref
                  >
                    <a className="hover:text-primary">
                      <div className="flex items-center">
                        <div className="relative mr-2 flex h-[48px] min-h-[48px] w-[48px] min-w-[48px] flex-col">
                          <ImageWithFallback
                            src={product?.detail?.image || ''}
                            alt="product image"
                            layout="fill"
                            style={{ objectFit: 'contain' }}
                          />
                        </div>
                        <div>
                          <Typography.Text className="block text-xs font-medium">
                            {(policy?.requiredProdQty || 0) * cartGift.quantity}{' '}
                            <span className="font-normal">x</span>{' '}
                            {getProductName(product)}
                          </Typography.Text>
                          {policy.prodInfo?.retailPrice && (
                            <Typography.Text className="mt-2 block text-xs font-medium text-gray-500">
                              {CurrencyUtils.format(
                                policy.prodInfo?.retailPrice
                              )}
                            </Typography.Text>
                          )}
                        </div>
                      </div>
                    </a>
                  </Link>
                  &nbsp;
                </li>
              );
            })}
          </ul>

          <div className="pl-0">
            <Typography.Paragraph className="text-semibold m-0 mt-2 pl-4 text-xs text-gray-500">
              Quà tặng
            </Typography.Paragraph>

            <ul className="pl-8">
              {cartGift.giftPromotion.gifts?.map((gift) => {
                const product = products.find((p) => p.key === gift.prodId);
                return (
                  <li key={product?.key} className="my-1 flex">
                    <Link
                      href={`/${product?.productType?.seoUrl}/${product?.detail?.seoUrl}`}
                      passHref
                    >
                      <a className="hover:text-primary">
                        <div className="flex items-center">
                          <div className="relative mr-2 flex h-[28px] min-h-[28px] w-[28px] min-w-[28px] flex-col">
                            <ImageWithFallback
                              src={product?.detail?.image || ''}
                              alt="product image"
                              layout="fill"
                              style={{ objectFit: 'contain' }}
                            />
                          </div>
                          <Typography.Text className="text-[12px] font-medium">
                            {(gift?.prodQty || 0) * cartGift.quantity}{' '}
                            <span className="font-normal">x</span>{' '}
                            {getProductName(product)}
                          </Typography.Text>
                        </div>
                      </a>
                    </Link>
                    &nbsp;
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Collapse.Panel>
    </Collapse>
  );
}

export default CartItemGiftDetailCollapsse;
