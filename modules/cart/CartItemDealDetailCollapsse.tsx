import ImageWithFallback from '@components/templates/ImageWithFallback';
import { CartDeal } from '@configs/models/product.model';
import { getProductName } from '@libs/helpers';
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

function CartItemDealDetailCollapsse({ cartDeal }: { cartDeal: CartDeal }) {
  const productIds = [
    ...(cartDeal.dealPromotion.policies?.map((p) => p.prodId) || []),
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
              Gói khuyến mãi {products.length} sản phẩm
            </Typography.Text>
          </span>
        }
        key="1"
        className="p-0"
      >
        <ul className="p-0">
          {cartDeal.dealPromotion.policies?.map((policy) => {
            const product = products.find((p) => p.key === policy.prodId);
            return (
              <li key={policy.prodId} className="my-1 flex">
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
                      <Typography.Text className="text-xs font-medium">
                        {(policy.requiredProdQty || 0) * cartDeal.quantity}{' '}
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
      </Collapse.Panel>
    </Collapse>
  );
}

export default CartItemDealDetailCollapsse;
