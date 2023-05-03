import { PercentageOutlined } from '@ant-design/icons';
import { PromotionPercent } from '@configs/models/promotion.model';
import { Collapse as AntdCollapse, Typography } from 'antd';
import styled from 'styled-components';

const Collapse = styled(AntdCollapse)`
  .ant-collapse-item .ant-collapse-header {
    padding: 0;
    padding-bottom: 4px;
  }
`;

function CartProductItemCollapse({
  promotionPercents,
}: {
  promotionPercents: PromotionPercent[];
}) {
  return (
    <Collapse
      defaultActiveKey={['1']}
      ghost
      className="product-cart-item-collapse mt-1"
    >
      <Collapse.Panel
        header={
          <span className="mb-[-32px] inline-block rounded-lg border border-solid border-waring-border bg-waring-background px-2 py-0 text-waring">
            <PercentageOutlined className="text-xs" />{' '}
            <Typography.Text className="text-xs text-inherit">
              Khuyến mãi
            </Typography.Text>
          </span>
        }
        key="1"
        className="p-0"
      >
        {promotionPercents.map((promotionPercent) => (
          <Typography className="my-1 text-xs" key={promotionPercent.key}>
            Giảm {promotionPercent.val * 100}% khi mua tối thiểu{' '}
            {promotionPercent.productQuantityMinCondition} sản phẩm
          </Typography>
        ))}
      </Collapse.Panel>
    </Collapse>
  );
}

export default CartProductItemCollapse;
