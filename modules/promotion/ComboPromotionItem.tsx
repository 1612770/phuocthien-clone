import { Typography } from 'antd';
import { ComboPromotion } from '@libs/client/Promotion';
import useProductAutoLoadByIds from '@libs/utils/hooks/useProductAutoLoadByIds';
import AddToCartButton from '@modules/products/AddToCartButton';
import CurrencyUtils from '@libs/utils/currency.utils';
import ProductImages from './ProductImages';
import Link from 'next/link';

function ComboPromotionItem({
  comboPromotion,
}: {
  comboPromotion: ComboPromotion;
}) {
  const productIds = (comboPromotion.policy || []).map(
    (policy) => policy.productId
  );

  const { products } = useProductAutoLoadByIds(productIds);

  const imageUrls =
    products.map(
      (product) => product.images?.[0].image || product.detail?.image || ''
    ) || [];

  const productsWithPolicyAndDiscount = products.map((product) => {
    const policy = comboPromotion.policy?.find(
      (policy) => policy.productId === product.key
    );

    const discount = comboPromotion.discount?.find(
      (discount) => discount.productId === product.key
    );

    return {
      ...product,
      policy,
      discount,
    };
  });

  return (
    <div className="mb-4 flex flex-col gap-4 md:flex-row">
      <div className="relative h-[200px] w-1/3 flex-none">
        <ProductImages imageUrls={imageUrls} />
      </div>
      <div className="flex-auto pt-2">
        <Typography.Title level={4}>{comboPromotion.name}</Typography.Title>

        <ul>
          {productsWithPolicyAndDiscount.map((product) => (
            <li key={product.key}>
              <Link
                href={`/${product?.productType?.seoUrl}/${product?.detail?.seoUrl}`}
                passHref
              >
                <a className="hover:text-primary">
                  <Typography.Text>
                    {product.policy?.requiredQty} x{' '}
                    <b>{product.detail?.displayName}</b>
                  </Typography.Text>
                </a>
              </Link>
              &nbsp;
            </li>
          ))}
        </ul>

        <Typography.Title level={3} className="m-0 text-primary">
          {CurrencyUtils.format(comboPromotion.totalCost)}
        </Typography.Title>
        <Typography.Paragraph className="line-through">
          {CurrencyUtils.format(comboPromotion.totalAmount)}
        </Typography.Paragraph>

        <AddToCartButton
          label="Chọn mua combo"
          className="w-full rounded-full shadow-none transition duration-300 group-hover:border-primary-light group-hover:bg-primary-light group-hover:text-white"
          comboPromotion={{ ...comboPromotion, images: imageUrls }}
        />
      </div>
    </div>
  );
}

export default ComboPromotionItem;
